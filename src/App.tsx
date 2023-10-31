import './App.css';
import './components/Loader/loader.style.css';
import './components/Item/item.style.css';
import './components/Search/search.style.css';
import './components/ErrorBoundary/error.style.css';
import React, { useCallback, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import type { PokemonSearchInfo } from './types';
import Search from './components/Search/Search';
import Item from './components/Item/Item';
import notFound from './assets/ditto.png';
import Loader from './components/Loader/Loader';
import ComponentsErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Pagination from './components/Pagination/Pagination';

export default function App() {
  const [state, setAppState] = useState({
    pokemons: [] as PokemonSearchInfo[],
    isLoading: true,
    doError: false,
  });

  const getData = useCallback(
    async (additional: string): Promise<PokemonSearchInfo[]> => {
      setAppState({ pokemons: [], isLoading: true, doError: state.doError });
      return fetch('https://pokeapi.co/api/v2/pokemon'.concat(additional))
        .then((data) => data.json())
        .then((res) => res.results);
    },
    [state.doError, setAppState]
  );

  const decideIsError = () => {
    return Math.floor(Math.random() * (10 - 1)) + 1 === 5 && state.doError;
  };

  const search = useCallback(
    async (text = '', canMakeError = false) => {
      if (!text) {
        setAppState({
          pokemons: await getData('?limit=20'),
          isLoading: false,
          doError: canMakeError,
        });
      } else {
        const allPokemons = await getData('?limit=2000');
        setAppState({
          pokemons: allPokemons.filter((el) => el.name.toLowerCase().includes(text.toLowerCase())),
          isLoading: false,
          doError: canMakeError,
        });
      }
    },
    [getData]
  );

  useEffect(() => {
    search(localStorage.getItem('pokedexSearch') ?? '').catch((err) => console.error(err));
  }, [search]);

  return (
    <>
      <Search searchMethod={search} />
      {state.isLoading ? (
        <Loader isBig />
      ) : (
        <>
          {state.pokemons.length === 0 ? (
            <div className="not-found">
              <img src={notFound} alt="not found" />
              <h3>Nothing was found...</h3>
            </div>
          ) : (
            state.pokemons.map((el) => {
              return (
                <ComponentsErrorBoundary updateMethod={search} key={nanoid(5)}>
                  <Item pokemonInfo={el} key={el.name} id={el.name} doError={decideIsError()} />
                </ComponentsErrorBoundary>
              );
            })
          )}
        </>
      )}
      <Pagination totalElements={1200} elementsPerPage={20} />
    </>
  );
}
