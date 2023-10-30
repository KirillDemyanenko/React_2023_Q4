import React, { useEffect, useState } from 'react';
import { SearchProps } from '../../types';

export default function Search(props: SearchProps) {
  const [text, setText] = useState('');
  const { searchMethod } = props;

  useEffect(() => {
    const savedText = localStorage.getItem('pokedexSearch') ?? '';
    setText(savedText);
    searchMethod(savedText, false);
  }, [searchMethod]);

  const handleClick = (): void => {
    searchMethod(text, false);
  };

  const makeError = () => {
    searchMethod(text, true);
  };

  const saveToStorage = (textForStorageSave: string) => {
    setText(textForStorageSave);
    localStorage.setItem('pokedexSearch', textForStorageSave);
  };

  const clearInput = () => {
    saveToStorage('');
    searchMethod('', false);
  };

  return (
    <div className="search">
      <div className="wrapper">
        <input
          type="text"
          value={text}
          onChange={(event) => saveToStorage(event.target.value)}
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
