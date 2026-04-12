// frontend/src/hooks/useReports.js
import { useState, useEffect, useCallback } from 'react';
import { reportsAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Manages reports list state with pagination, filtering, and CRUD ops.
 */
const useReports = (initialParams = {}) => {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ limit: 10, page: 1, ...initialParams });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportsAPI.getAll(params);
      setReports(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const updateParams = (newParams) =>
    setParams((prev) => ({ ...prev, ...newParams, page: 1 }));

  const setPage = (page) => setParams((prev) => ({ ...prev, page }));

  const deleteReport = async (id) => {
    try {
      await reportsAPI.delete(id);
      toast.success('Report deleted');
      fetchReports();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateStatus = async (id, status, admin_notes) => {
    try {
      await reportsAPI.update(id, { status, admin_notes });
      toast.success('Status updated');
      fetchReports();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return {
    reports,
    pagination,
    loading,
    params,
    updateParams,
    setPage,
    refetch: fetchReports,
    deleteReport,
    updateStatus,
  };
};

export default useReports;
