// frontend/src/components/charts/DamageTypeChart.jsx
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { capitalize } from '../../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#6b7280'];

const DamageTypeChart = ({ byType = {} }) => {
  const labels = Object.keys(byType).map(capitalize);
  const values = Object.values(byType);

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: COLORS.slice(0, labels.length).map((c) => c + '99'),
      borderColor: COLORS.slice(0, labels.length),
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 16, font: { family: 'Poppins', size: 12 }, color: '#94a3b8' },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw} report${ctx.raw !== 1 ? 's' : ''}`,
        },
      },
    },
    cutout: '62%',
  };

  if (values.length === 0) {
    return <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No data yet</p>;
  }

  return (
    <div style={{ height: '260px', position: 'relative' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DamageTypeChart;
