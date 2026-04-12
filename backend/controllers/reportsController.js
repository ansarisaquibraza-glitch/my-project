// backend/controllers/reportsController.js
// CRUD operations for road damage reports

const supabase = require('../config/supabase');

/**
 * POST /api/reports
 * Creates a new road damage report.
 * Image URL is provided after client-side upload to Supabase Storage.
 */
const createReport = async (req, res, next) => {
  try {
    const {
      damage_type,
      description,
      latitude,
      longitude,
      image_url,
      reporter_name,
      reporter_email,
      reporter_phone,
      address,
    } = req.body;

    const { data, error } = await supabase
      .from('reports')
      .insert([
        {
          damage_type,
          description,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          image_url: image_url || null,
          reporter_name,
          reporter_email,
          reporter_phone: reporter_phone || null,
          address: address || null,
          status: 'pending',
          user_id: req.user?.id || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports
 * Retrieves all reports with optional filters and pagination.
 * Query params: status, damage_type, search, page, limit, sort
 */
const getAllReports = async (req, res, next) => {
  try {
    const {
      status,
      damage_type,
      search,
      page = 1,
      limit = 10,
      sort = 'created_at',
      order = 'desc',
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('reports')
      .select('*', { count: 'exact' });

    // Apply filters
    if (status) query = query.eq('status', status);
    if (damage_type) query = query.eq('damage_type', damage_type);
    if (search) {
      query = query.or(
        `description.ilike.%${search}%,reporter_name.ilike.%${search}%,address.ilike.%${search}%`
      );
    }

    // Sorting and pagination
    query = query
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      success: true,
      data,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/:id
 * Retrieves a single report by ID.
 */
const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/reports/:id
 * Updates a report's status (admin only).
 * Also allows updating notes/resolution info.
 */
const updateReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const updatePayload = {};
    if (status) updatePayload.status = status;
    if (admin_notes !== undefined) updatePayload.admin_notes = admin_notes;
    if (status === 'resolved') updatePayload.resolved_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('reports')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, message: 'Report updated', data });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/reports/:id
 * Deletes a report (admin only).
 */
const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/stats/summary
 * Returns aggregate stats for dashboard charts.
 */
const getStats = async (req, res, next) => {
  try {
    // Total counts by status
    const { data: statusData, error: statusErr } = await supabase
      .from('reports')
      .select('status');

    if (statusErr) throw statusErr;

    const stats = {
      total: statusData.length,
      pending: statusData.filter((r) => r.status === 'pending').length,
      in_progress: statusData.filter((r) => r.status === 'in_progress').length,
      resolved: statusData.filter((r) => r.status === 'resolved').length,
      rejected: statusData.filter((r) => r.status === 'rejected').length,
    };

    // Counts by damage type
    const { data: typeData, error: typeErr } = await supabase
      .from('reports')
      .select('damage_type');

    if (typeErr) throw typeErr;

    const byType = typeData.reduce((acc, r) => {
      acc[r.damage_type] = (acc[r.damage_type] || 0) + 1;
      return acc;
    }, {});

    // Monthly trend — last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: monthlyData, error: monthlyErr } = await supabase
      .from('reports')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString());

    if (monthlyErr) throw monthlyErr;

    const monthly = monthlyData.reduce((acc, r) => {
      const month = new Date(r.created_at).toLocaleString('default', {
        month: 'short',
        year: '2-digit',
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    res.json({ success: true, data: { stats, byType, monthly } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/export
 * Exports all reports as JSON (admin only).
 */
const exportReports = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.setHeader('Content-Disposition', 'attachment; filename=reports-export.json');
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
  getStats,
  exportReports,
};
