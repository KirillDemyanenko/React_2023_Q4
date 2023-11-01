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
  });
  const [doError, setDoError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pokemonsCount, setPokemonsCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Set new query params
   * @param {number=} [page=1] Page number.
   * @param {number} [limit=20] Items per page.
   * @param {string} [search=''] Search text.
   */
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

  /**
   * Returns query params
   * @returns {[limit: number, page: number, search: string]}
   */
  const readSearchParameters = useCallback(() => {
    return [
      parseInt(searchParams.get('limit') || '20', 10),
      parseInt(searchParams.get('page') || '1', 10),
      searchParams.get('search') || '',
    ];
  }, [searchParams]);

  /**
   * @returns {boolean} Return random boolean value if we need throw error
   */
  const decideIsError = (): boolean => {
    return Math.floor(Math.random() * (10 - 1)) + 1 === 5 && doError;
  };

  /**
   * Fetch data from API and set in state number of elements found.
   * Without params return all records.
   * @param {number} [offset=0] Quantity skipped records
   * @param {limit} [limit=1292] Quantity items in response
   * @returns {Promise<PokemonSearchInfo[]>} Return array of Pokémon Promise
   */
  const getData = useCallback(async (offset = 0, limit = 1292): Promise<PokemonSearchInfo[]> => {
    return fetch(import.meta.env.VITE_API_URL.concat(`?offset=${offset}&limit=${limit}`))
      .then((data) => data.json())
      .then((res: PokemonsResponse) => {
        setPokemonsCount(res.count);
        return res.results;
      });
  }, []);

  const search = useCallback(
    async (text = '', canMakeError = false) => {
      setIsLoading(true);
      setDoError(canMakeError);
      const [limit, page] = readSearchParameters();
      changeSearchParameters(Number(page), Number(limit), text);
      if (!text) {
        setAppState({
          pokemons: await getData((Number(page) - 1) * Number(limit), Number(limit)),
        });
      } else {
        const foundPokemons = await getData().then((data) =>
          data.filter((el) => el.name.toLowerCase().includes(text.toLowerCase()))
        );
        setAppState({
          pokemons: foundPokemons.slice(
            (Number(page) - 1) * Number(limit),
            (Number(page) - 1) * Number(limit) + Number(limit)
          ),
        });
        setPokemonsCount(foundPokemons.length);
      }
      setIsLoading(false);
    },
    [getData, readSearchParameters, changeSearchParameters]
  );

  useEffect(() => {
    const [limit, page, searchInit] = readSearchParameters();
    if (searchInit) localStorage.setItem('pokedexSearch', String(searchInit));
    changeSearchParameters(
      Number(page),
      Number(limit),
      localStorage.getItem('pokedexSearch') ?? ''
    );
    search(localStorage.getItem('pokedexSearch') ?? '').catch((err) => console.error(err));
  }, [readSearchParameters, changeSearchParameters, search, searchParams]);

  return (
    <>
      <Search searchMethod={search} />
      {isLoading ? (
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
                  <Item
                    pokemonInfo={el}
                    key={el.name}
                    id={el.name}
                    doError={doError ? decideIsError() : false}
                  />
                </ComponentsErrorBoundary>
              );
            })
          )}
        </>
      )}
      {!isLoading && (
        <Pagination
          changeCount={changeSearchParameters}
          totalElements={pokemonsCount}
          elementsPerPage={Number(searchParams.get('limit'))}
        />
      )}
    </>
  );
}
