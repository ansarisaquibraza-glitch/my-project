// frontend/src/pages/user/ReportPage.jsx
import ReportForm from '../../components/forms/ReportForm';

const ReportPage = () => (
  <div className="page-wrapper">
    <div className="container" style={{ maxWidth: '820px' }}>
      <div className="page-header">
        <h1 className="page-title">📍 Report Road Damage</h1>
        <p className="page-subtitle">
          Help improve your city's infrastructure. Fill in the details below and we'll forward
          your report to the relevant authorities.
        </p>
      </div>
      <ReportForm />
    </div>
  </div>
);

export default ReportPage;
