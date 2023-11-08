import React, { useCallback, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchProps } from '../../types';
import AppContext from '../../main';

export default function Search(props: SearchProps) {
  const { searchMethod } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const context = useContext(AppContext);

  const changeSearchParameters = useCallback(
    (page = 1, limit = 20, search = '') => {
      const query: string[][] = [
        ['page', page.toString()],
        ['limit', limit.toString()],
      ];
      if (search) query.push(['search', search]);
      setSearchParams(new URLSearchParams(query));
    },
    [setSearchParams]
  );

  const handleClick = (): void => {
    changeSearchParameters(1, parseInt(searchParams.get('limit') ?? '20', 10), context.search);
    searchMethod(context.search, false);
  };

  const makeError = () => {
    searchMethod(context.search, true);
  };

  const saveToStorage = (textForStorageSave: string) => {
    context.search = textForStorageSave;
    changeSearchParameters(1, parseInt(searchParams.get('limit') ?? '20', 10), context.search);
    localStorage.setItem('pokedexSearch', context.search);
  };

  const clearInput = () => {
    saveToStorage('');
    searchMethod(context.search, false);
  };

  return (
    <div className="search">
      <div className="wrapper">
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
            className="clear"
            onClick={clearInput}
          >
            ❌
          </div>
        )}
        <button type="button" onClick={handleClick}>
          search
        </button>
      </div>
      <button type="button" className="make-error" onClick={makeError}>
        Make error
      </button>
    </div>
  );
}
