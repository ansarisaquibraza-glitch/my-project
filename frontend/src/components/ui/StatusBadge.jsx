// frontend/src/components/ui/StatusBadge.jsx
import { statusIcon, capitalize } from '../../utils/helpers';

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status}`}>
    {statusIcon[status]} {capitalize(status)}
  </span>
);

export default StatusBadge;
