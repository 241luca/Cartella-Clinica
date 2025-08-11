// Redirect to new calendar page
import { Navigate } from 'react-router-dom';

const TherapyCalendar = () => {
  return <Navigate to="/calendar" replace />;
};

export default TherapyCalendar;
