import './App.css';
import './components/Loader/loader.style.css';
import './components/Item/item.style.css';
import './components/Search/search.style.css';
import './components/ErrorBoundary/error.style.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import type { PokemonSearchInfo, PokemonsResponse } from './types';
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
  const [pokemonsCount, setPokemonsCount] = useState(0);
  const [pokemonsPerPage, setPokemonsPerPage] = useState(20);
  const [searchParams, setSearchParams] = useSearchParams();

  const changeSearchParameters = useCallback(
    (page = 0, limit = 20, search = '') => {
      const query: string[][] = [];
      if (page > -1) query.push(['page', (page + 1).toString()]);
      if (limit > 0) query.push(['limit', limit.toString()]);
      if (search) query.push(['search', search]);
      setSearchParams(new URLSearchParams(query));
      setPokemonsPerPage(limit);
    },
    [setSearchParams]
  );

  const readSearchParameters = useCallback(() => {
    const limit = searchParams.get('limit') ?? '20';
    const search = searchParams.get('search') ?? '';
    const page = searchParams.get('page') ?? '0';
    return [limit, page, search];
  }, [searchParams]);

  const getData = useCallback(
    async (additional: string): Promise<PokemonSearchInfo[]> => {
      setAppState({ pokemons: [], isLoading: true, doError: state.doError });
      return fetch('https://pokeapi.co/api/v2/pokemon'.concat(additional))
        .then((data) => data.json())
        .then((res: PokemonsResponse) => {
          setPokemonsCount(res.count);
          return res.results;
        });
    },
    [state.doError, setAppState]
  );

  const decideIsError = () => {
    return Math.floor(Math.random() * (10 - 1)) + 1 === 5 && state.doError;
  };

  const search = useCallback(
    async (text = '', canMakeError = false) => {
      const [limit, page] = readSearchParameters();
      if (!text) {
        const offset = searchParams.get('offset') ? `offset=${searchParams.get('offset')}` : '';
        let params = '';
        if (offset) {
          params = '?'.concat(offset);
        }
        if (limit) {
          if (offset) {
            params.concat('&', offset);
          } else {
            params = '?'.concat(`limit=${limit}`);
          }
        }
        setAppState({
          pokemons: await getData(params),
          isLoading: false,
          doError: canMakeError,
        });
        changeSearchParameters(parseInt(page, 10) - 1, parseInt(limit, 10), text);
      } else {
        const allPokemons = await getData('?limit=2000');
        const foundPokemons = allPokemons.filter((el) =>
          el.name.toLowerCase().includes(text.toLowerCase())
        );
        setAppState({
          pokemons: foundPokemons,
          isLoading: false,
          doError: canMakeError,
        });
        changeSearchParameters(0, parseInt(limit, 10), text);
        setPokemonsCount(foundPokemons.length);
      }
    },
    [getData, searchParams, readSearchParameters, changeSearchParameters]
  );

  useEffect(() => {
    const [limit, page, searchInit] = readSearchParameters();
    changeSearchParameters(parseInt(page, 10) - 1, parseInt(limit, 10), searchInit);
    search(localStorage.getItem('pokedexSearch') ?? '').catch((err) => console.error(err));
  }, [search, readSearchParameters, changeSearchParameters]);

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
      {!state.isLoading && (
        <Pagination
          changeCount={changeSearchParameters}
          totalElements={pokemonsCount}
          elementsPerPage={pokemonsPerPage}
        />
      )}
    </>
  );
}
