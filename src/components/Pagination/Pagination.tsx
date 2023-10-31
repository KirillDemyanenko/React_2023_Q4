import { useState } from 'react';
import { nanoid } from 'nanoid';
import { PaginationProps } from '../../types';
import styles from './pagination.module.css';

export default function Pagination(props: PaginationProps) {
  const { elementsPerPage, totalElements } = props;
  const [elOnPage, setElOnPage] = useState(elementsPerPage);

  const changeState = (ev) => {
    const target = ev.target as HTMLSelectElement;
    setElOnPage(parseInt(target.value, 10));
  };

  return (
    <>
      <div className={styles.pagination}>
        <div className={styles.pages}>
          <div className={styles.arrowLeft}>&laquo;</div>
          {Math.ceil(totalElements / elOnPage) <= 6 ? (
            [...Array(6)].map((_, index) => (
              <span className={styles.num} key={nanoid(5)}>
                {index + 1}
              </span>
            ))
          ) : (
            <>
              {[...Array.from(Array(3).keys())].map((el) => (
                <span className={styles.num} key={nanoid(5)}>
                  {el + 1}
                </span>
              ))}
              <span style={{ border: 'none' }} className={styles.num} key={nanoid(5)}>
                {' '}
                ...{' '}
              </span>
              {[...Array.from(Array(Math.ceil(totalElements / elOnPage)).keys())]
                .splice(Math.ceil(totalElements / elOnPage) - 3)
                .map((el) => (
                  <span className={styles.num} key={nanoid(5)}>
                    {el + 1}
                  </span>
                ))}
            </>
          )}
          <div className={styles.arrowRight}>&raquo;</div>
        </div>
        <div className={styles.info}>
          <p> Total results: {totalElements}</p>
          <label htmlFor="perPage">
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
