import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { PaginationProps } from '../../types';
import styles from './pagination.module.css';

export default function Pagination(props: PaginationProps) {
  const { elementsPerPage, totalElements, changeCount } = props;
  const [elOnPage] = useState(elementsPerPage);
  const [searchParams] = useSearchParams();
  const [state, setState] = useState({ limit: '20', search: '', page: '0' });

  useEffect(() => {
    const limit = searchParams.get('limit') ?? '20';
    const search = searchParams.get('search') ?? '';
    const page = searchParams.get('page') ?? '1';
    setState({ limit, search, page });
  }, [searchParams]);

  const changeState = (ev: Event) => {
    const target = ev.target as HTMLSelectElement;
    changeCount(1, parseInt(target?.value, 10), state.search);
  };

  const changePage = (ev: Event) => {
    const target = ev.target as HTMLSpanElement;
    changeCount(parseInt(target.innerText, 10), parseInt(state.limit, 10), state.search);
  };

  return (
    <>
      <div className={styles.pagination}>
        <div className={styles.pages}>
          <div className={styles.arrowLeft}>&laquo;</div>
          {Math.ceil(totalElements / elOnPage) <= 6 ? (
            [...Array(Math.ceil(totalElements / elOnPage))].map((_, index) => (
              <span
                role="button"
                tabIndex={0}
                onKeyDown={changePage}
                onClick={changePage}
                className={state.page === (index + 1).toString() ? styles.selected : styles.num}
                key={nanoid(5)}
              >
                {index + 1}
              </span>
            ))
          ) : (
            <>
              {[...Array.from(Array(3).keys())].map((el) => (
                <span
                  role="button"
                  tabIndex={0}
                  onKeyDown={changePage}
                  onClick={changePage}
                  className={state.page === (el + 1).toString() ? styles.selected : styles.num}
                  key={nanoid(5)}
                >
                  {el + 1}
                </span>
              ))}
              <span style={{ border: 'none' }} className={styles.num} key={nanoid(5)}>
                {' '}
                ...{' '}
              </span>
              {[...Array.from(Array(Math.ceil(totalElements / Number(state.limit))).keys())]
                .splice(Math.ceil(totalElements / elOnPage) - 3)
                .map((el) => (
                  <span
                    role="button"
                    tabIndex={0}
                    onKeyDown={changePage}
                    onClick={changePage}
                    className={state.page === (el + 1).toString() ? styles.selected : styles.num}
                    key={nanoid(5)}
                  >
                    {el + 1}
                  </span>
                ))}
            </>
          )}
          <div className={styles.arrowRight}>&raquo;</div>
        </div>
        <div className={styles.info}>
          <p className={styles.bottom_info}> Total results: {totalElements}</p>
          <label className={styles.bottom_info} htmlFor="perPage">
            Element per page
            <select name="perPage" id="perPage" defaultValue={elOnPage} onChange={changeState}>
              <option value="" disabled>
                -- Choose one --
              </option>
              {[...Array(10)].map((_, i) => (
                <option key={`option-${(i + 1) * 10}`} value={(i + 1) * 10}>
                  {(i + 1) * 10}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </>
  );
}
