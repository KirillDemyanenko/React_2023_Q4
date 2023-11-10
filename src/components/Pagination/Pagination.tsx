import React, { useContext, useState } from 'react';
import { nanoid } from 'nanoid';
import { PaginationProps } from '../../types';
import styles from './pagination.module.css';
import AppContext from '../../main';

export default function Pagination(props: PaginationProps) {
  const { elementsPerPage, totalElements } = props;
  const [elOnPage] = useState(elementsPerPage);
  const context = useContext(AppContext);

  const changeLimit = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = ev.target;
    context.limit = parseInt(value, 10);
    context.page = 1;
    context.changeSearchParameters();
  };

  const changePage = ({
    currentTarget: target,
  }: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>) => {
    context.page = parseInt(target.innerText, 10);
    context.changeSearchParameters();
  };

  const nextPage = () => {
    const pageQuantity = Math.ceil(totalElements / elOnPage);
    if (context.page < pageQuantity) {
      context.page += 1;
      context.changeSearchParameters();
    }
  };

  const previousPage = () => {
    if (context.page > 1) {
      context.page -= 1;
      context.changeSearchParameters();
    }
  };

  const calculatePagesArray = () => {
    const pageQuantity = Math.ceil(totalElements / elOnPage);
    if (pageQuantity <= 7) {
      return [...Array.from(Array(pageQuantity).keys())];
    }
    if (context.page < 5) {
      return [...Array.from(Array(5).keys()), ...[-1, pageQuantity - 1]];
    }
    if (context.page > 4 && context.page < pageQuantity - 3) {
      return [
        ...[0, -1],
        ...Array.from(Array(pageQuantity).keys()).splice(
          context.page - 3,
          pageQuantity - (pageQuantity - 5)
        ),
        ...[-1, pageQuantity - 1],
      ];
    }
    if (context.page >= pageQuantity - 6) {
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
            className={context.page > 1 ? styles.arrowLeft : styles.arrowLeftDisabled}
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
                className={context.page === el + 1 ? styles.selected : styles.num}
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
              context.page < Math.ceil(totalElements / elOnPage)
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
