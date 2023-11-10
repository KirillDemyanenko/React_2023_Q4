import './App.css';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import type { PokemonSearchInfo } from './types';
import Search from './components/Search/Search';
import Item from './components/Item/Item';
import notFound from './assets/ditto.png';
import Loader from './components/Loader/Loader';
import ComponentsErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Pagination from './components/Pagination/Pagination';
import AppContext from './main';
import { readSearchFromStorage, writeSearchFromStorage } from './helpers/workWithStorage';
import getDataFRomAPI from './api/getDataFRomAPI';

export default function App() {
  const [doError, setDoError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pokemonsCount, setPokemonsCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const context = useContext(AppContext);
  const [pokemons, setPokemons] = useState(new Array<PokemonSearchInfo>());

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

  const search = useCallback(
    async (text = '', canMakeError = false) => {
      setIsLoading(true);
      setDoError(canMakeError);
      const [limit, page] = readSearchParameters();
      changeSearchParameters(Number(page), Number(limit), text);
      if (!text) {
        const [pokemons1, pokemonsCount1] = await getDataFRomAPI<[PokemonSearchInfo[], number]>(
          `?offset=${(+page - 1) * +limit}&limit=${limit}`
        );
        setPokemons(pokemons1);
        setPokemonsCount(pokemonsCount1);
      } else {
        const [pokemons2] = await getDataFRomAPI<[PokemonSearchInfo[], number]>('?limit=1292');
        const foundPokemons = pokemons2.filter((el) =>
          el.name.toLowerCase().includes(text.toLowerCase())
        );
        setPokemonsCount(foundPokemons.length);
        setPokemons(foundPokemons.slice((+page - 1) * +limit, (+page - 1) * +limit + +limit));
      }
      setIsLoading(false);
    },
    [readSearchParameters, changeSearchParameters]
  );

  useEffect(() => {
    const [limit, page, searchInit] = readSearchParameters();
    if (searchInit) writeSearchFromStorage(String(searchInit));
    context.search = readSearchFromStorage();
    changeSearchParameters(+page, +limit, readSearchFromStorage());
    search(context.search).catch((err) => console.error(err));
  }, [readSearchParameters, changeSearchParameters, search, context]);

  return (
    <>
      <Search searchMethod={search} />
      {isLoading ? (
        <Loader isBig />
      ) : (
        <>
          {pokemons.length === 0 ? (
            <div className="not-found">
              <img src={notFound} alt="not found" />
              <h3>Nothing was found...</h3>
            </div>
          ) : (
            pokemons.map((el) => {
              return (
                <ComponentsErrorBoundary updateMethod={search} key={nanoid(5)}>
                  <Item pokemonInfo={el} key={el.name} doError={decideIsError()} />
                </ComponentsErrorBoundary>
              );
            })
          )}
        </>
      )}
      {!isLoading && pokemons.length > 0 && (
        <Pagination
          changeCount={changeSearchParameters}
          totalElements={pokemonsCount}
          elementsPerPage={Number(searchParams.get('limit'))}
        />
      )}
    </>
  );
}
