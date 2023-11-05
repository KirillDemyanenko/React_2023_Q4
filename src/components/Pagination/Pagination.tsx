import React, { useEffect, useState } from 'react';
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

  const changeLimit = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = ev.target;
    changeCount(1, parseInt(value, 10), state.search);
  };

  const changePage = ({
    currentTarget: target,
  }: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>) => {
    changeCount(parseInt(target.innerText, 10), parseInt(state.limit, 10), state.search);
  };

  const nextPage = () => {
    const pageQuantity = Math.ceil(totalElements / elOnPage);
    if (+state.page < pageQuantity) {
      changeCount(+state.page + 1, parseInt(state.limit, 10), state.search);
    }
  };

  const previousPage = () => {
    if (+state.page > 1) {
      changeCount(+state.page - 1, parseInt(state.limit, 10), state.search);
    }
  };

  const calculatePagesArray = () => {
    const pageQuantity = Math.ceil(totalElements / elOnPage);
    if (pageQuantity <= 7) {
      return [...Array.from(Array(pageQuantity).keys())];
    }
    if (+state.page < 5) {
      return [...Array.from(Array(5).keys()), ...[-1, pageQuantity - 1]];
    }
    if (+state.page > 4 && +state.page < pageQuantity - 3) {
      return [
        ...[0, -1],
        ...Array.from(Array(pageQuantity).keys()).splice(
          +state.page - 3,
          pageQuantity - (pageQuantity - 5)
        ),
        ...[-1, pageQuantity - 1],
      ];
    }
    if (+state.page >= pageQuantity - 6) {
      return [...[0, -1], ...Array.from(Array(pageQuantity).keys()).splice(pageQuantity - 5)];
    }
    return [];
  };

  return (
    <>
      <div className={styles.pagination}>
        <div className={styles.pages}>
          <div
            role="button"
            onKeyDown={previousPage}
            onClick={previousPage}
            tabIndex={0}
            className={+state.page > 1 ? styles.arrowLeft : styles.arrowLeftDisabled}
          >
            &laquo;
          </div>
          {calculatePagesArray().map((el) =>
            el >= 0 ? (
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
            ) : (
              <span
                style={{ border: 'none', cursor: 'default' }}
                className={styles.dots}
                key={nanoid(5)}
              >
                {' '}
                &#8230;{' '}
              </span>
            )
          )}
          <div
            role="button"
            tabIndex={0}
            onKeyDown={nextPage}
            onClick={nextPage}
            className={
              +state.page < Math.ceil(totalElements / elOnPage)
                ? styles.arrowRight
                : styles.arrowRightDisabled
            }
          >
            &raquo;
          </div>
        </div>
        <div className={styles.info}>
          <p className={styles.bottom_info}> Total results: {totalElements}</p>
          <label className={styles.bottom_info} htmlFor="perPage">
            Element per page
            <select name="perPage" id="perPage" defaultValue={elOnPage} onChange={changeLimit}>
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
