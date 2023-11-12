import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import App from '../App';
import styles from './layout.module.css';
import AppContext from '../main';

export default function Layout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const context = useContext(AppContext);

  const readSearchParameters = useCallback(() => {
    context.limit = parseInt(searchParams.get('limit') || '20', 10);
    context.page = parseInt(searchParams.get('page') || '1', 10);
    context.search = searchParams.get('search') || '';
  }, [searchParams, context]);

  const closePanel = () => {
    const query: string[][] = [
      ['page', context.page.toString()],
      ['limit', context.limit.toString()],
    ];
    if (context.search) query.push(['search', context.search]);
    const params = new URLSearchParams(query).toString();
    navigate(`/?${params}`);
  };

  const changeSearchParameters = useCallback(() => {
    const query: string[][] = [
      ['page', context.page.toString()],
      ['limit', context.limit.toString()],
    ];
    if (context.search) query.push(['search', context.search]);
    setSearchParams(new URLSearchParams(query));
  }, [setSearchParams, context.search, context.limit, context.page]);

  const closeDetailByClick = (ev: React.MouseEvent<HTMLElement>) => {
    if (location.pathname.includes('detail') && (ev.target as Element).className.includes('app')) {
      closePanel();
      readSearchParameters();
    }
  };

  const closeDetailByKey = () => {
    if (location.pathname.includes('detail')) {
      closePanel();
    }
  };

  useEffect(() => {
    context.changeSearchParameters = changeSearchParameters;
    context.readSearchParameters = readSearchParameters;
  }, [context, changeSearchParameters, readSearchParameters]);

  return (
    <>
      <AppContext.Provider value={useMemo(() => context, [context])}>
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
      </AppContext.Provider>
    </>
  );
}
