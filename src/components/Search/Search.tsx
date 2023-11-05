import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchProps } from '../../types';

export default function Search(props: SearchProps) {
  const [text, setText] = useState('');
  const { searchMethod } = props;
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const savedText = localStorage.getItem('pokedexSearch') ?? '';
    setText(savedText);
  }, []);

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
    changeSearchParameters(1, parseInt(searchParams.get('limit') ?? '20', 10), text);
    searchMethod(text, false);
  };

  const makeError = () => {
    searchMethod(text, true);
  };

  const saveToStorage = (textForStorageSave: string) => {
    setText(textForStorageSave);
    changeSearchParameters(1, parseInt(searchParams.get('limit') ?? '20', 10), textForStorageSave);
    localStorage.setItem('pokedexSearch', textForStorageSave);
  };

  const clearInput = () => {
    saveToStorage('');
    changeSearchParameters(1, parseInt(searchParams.get('limit') ?? '20', 10), text);
    searchMethod('', false);
  };

  return (
    <div className="search">
      <div className="wrapper">
        <input
          type="text"
          value={text}
          onChange={(event) => saveToStorage(event.target.value.trim())}
          placeholder="Type something..."
        />
        {text && (
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
