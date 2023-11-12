import React, { useContext, useState } from 'react';
import { SearchProps } from '../../types';
import AppContext from '../../main';
import styles from './search.module.css';
import { writeSearchFromStorage } from '../../helpers/workWithStorage';

export default function Search(props: SearchProps) {
  const { searchMethod } = props;
  const context = useContext(AppContext);
  const [timer, setTimerState] = useState(0);

  const handleClick = (): void => {
    context.page = 1;
    context.changeSearchParameters();
    searchMethod(context.search, false);
  };

  const makeError = () => {
    searchMethod(context.search, true);
  };

  const saveToStorage = (textForStorageSave: string) => {
    context.search = textForStorageSave;
    writeSearchFromStorage(context.search);
    if (timer) {
      clearTimeout(timer);
    }
    setTimerState(
      +setTimeout(() => {
        context.page = 1;
      }, 600)
    );
  };

  const clearInput = () => {
    saveToStorage('');
    searchMethod(context.search, false);
  };

  return (
    <div className={styles.search}>
      <div className={styles.wrapper}>
        <input
          type="text"
          value={context.search}
          onChange={(event) => saveToStorage(event.target.value.trim())}
          placeholder="Type something..."
        />
        {context.search && (
          <div
            tabIndex={0}
            role="button"
            onKeyDown={clearInput}
            className={styles.clear}
            onClick={clearInput}
          >
            ❌
          </div>
        )}
        <button type="button" onClick={handleClick}>
          search
        </button>
      </div>
      <button type="button" className={styles.makeError} onClick={makeError}>
        Make error
      </button>
    </div>
  );
}
