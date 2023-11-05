import { Outlet } from 'react-router-dom';
import App from '../App';

export default function Layout() {
  return (
    <>
      <App />
      <Outlet />
    </>
  );
}
