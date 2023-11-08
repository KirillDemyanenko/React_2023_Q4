import React, { useCallback } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import App from '../App';
import styles from './layout.module.css';

export default function Layout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const readSearchParameters = useCallback(() => {
    return [
      parseInt(searchParams.get('limit') || '20', 10),
      parseInt(searchParams.get('page') || '1', 10),
      searchParams.get('search') || '',
    ];
  }, [searchParams]);

  const closePanel = () => {
    const [limit, page, search] = readSearchParameters();
    const query: string[][] = [
      ['page', page.toString()],
      ['limit', limit.toString()],
    ];
    if (search) query.push(['search', search.toString()]);
    const params = new URLSearchParams(query).toString();
    navigate(`/?${params}`);
  };

  const closeDetailByClick = (ev: React.MouseEvent<HTMLElement>) => {
    if (location.pathname.includes('detail') && (ev.target as Element).className.includes('app')) {
      closePanel();
    }
  };

  const closeDetailByKey = () => {
    if (location.pathname.includes('detail')) {
      closePanel();
    }
  };

  return (
    <>
      <div
        className={styles.app}
        tabIndex={0}
        role="link"
        onKeyDown={closeDetailByKey}
        onClick={closeDetailByClick}
      >
        <App />
      </div>
      <Outlet />
    </>
  );
}
