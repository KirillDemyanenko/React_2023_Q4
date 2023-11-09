import './App.css';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import type { PokemonSearchInfo, PokemonsResponse } from './types';
import Search from './components/Search/Search';
import Item from './components/Item/Item';
import notFound from './assets/ditto.png';
import Loader from './components/Loader/Loader';
import ComponentsErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Pagination from './components/Pagination/Pagination';
import AppContext from './main';

export default function App() {
  const [doError, setDoError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pokemonsCount, setPokemonsCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const context = useContext(AppContext);

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
   * @param {number} [limit=1292] Quantity items in response
   * @returns {Promise<PokemonSearchInfo[]>} Return array of Pokémon Promise
   */
  const getData = useCallback(
    async (offset: number = 0, limit: number = 1292): Promise<PokemonSearchInfo[]> => {
      return fetch(import.meta.env.VITE_API_URL.concat(`?offset=${offset}&limit=${limit}`))
        .then((data) => data.json())
        .then((res: PokemonsResponse) => {
          setPokemonsCount(res.count);
          return res.results;
        });
    },
    []
  );

  const search = useCallback(
    async (text = '', canMakeError = false) => {
      setIsLoading(true);
      setDoError(canMakeError);
      const [limit, page] = readSearchParameters();
      changeSearchParameters(Number(page), Number(limit), text);
      if (!text) {
        context.pokemons = await getData((+page - 1) * +limit, +limit);
      } else {
        const foundPokemons = await getData().then((data) =>
          data.filter((el) => el.name.toLowerCase().includes(text.toLowerCase()))
        );
        context.pokemons = foundPokemons.slice((+page - 1) * +limit, (+page - 1) * +limit + +limit);
        setPokemonsCount(foundPokemons.length);
      }
      setIsLoading(false);
    },
    [getData, readSearchParameters, changeSearchParameters, context]
  );

  useEffect(() => {
    const [limit, page, searchInit] = readSearchParameters();
    if (searchInit) localStorage.setItem('pokedexSearch', String(searchInit));
    context.search = localStorage.getItem('pokedexSearch') ?? '';
    changeSearchParameters(+page, +limit, localStorage.getItem('pokedexSearch') ?? '');
    search(context.search).catch((err) => console.error(err));
  }, [readSearchParameters, changeSearchParameters, search, context]);

  return (
    <>
      <Search searchMethod={search} />
      {isLoading ? (
        <Loader isBig />
      ) : (
        <>
          {context.pokemons.length === 0 ? (
            <div className="not-found">
              <img src={notFound} alt="not found" />
              <h3>Nothing was found...</h3>
            </div>
          ) : (
            context.pokemons.map((el) => {
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
      {!isLoading && context.pokemons.length > 0 && (
        <Pagination
          changeCount={changeSearchParameters}
          totalElements={pokemonsCount}
          elementsPerPage={Number(searchParams.get('limit'))}
        />
      )}
    </>
  );
}
