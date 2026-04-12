// frontend/src/components/charts/MonthlyTrendChart.jsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyTrendChart = ({ monthly = {} }) => {
  const labels = Object.keys(monthly);
  const values = Object.values(monthly);

  const data = {
    labels,
    datasets: [{
      label: 'Reports',
      data: values,
      backgroundColor: 'rgba(37,99,235,0.55)',
      borderColor: '#2563eb',
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => ` ${ctx.raw} report${ctx.raw !== 1 ? 's' : ''}` },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#94a3b8', font: { family: 'Poppins', size: 11 } },
        grid: { color: 'rgba(148,163,184,0.15)' },
      },
      x: {
        ticks: { color: '#94a3b8', font: { family: 'Poppins', size: 11 } },
        grid: { display: false },
      },
    },
  };

  if (labels.length === 0) {
    return <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No trend data yet</p>;
  }

  return (
    <div style={{ height: '240px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlyTrendChart;
