import './App.css';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import type { PokemonSearchInfo } from './types';
import Search from './components/Search/Search';
import Item from './components/Item/Item';
import notFound from './assets/ditto.png';
import Loader from './components/Loader/Loader';
import ComponentsErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Pagination from './components/Pagination/Pagination';
import AppContext from './main';
import { writeSearchFromStorage } from './helpers/workWithStorage';
import getDataFRomAPI from './api/getDataFRomAPI';

export default function App() {
  const [doError, setDoError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(AppContext);

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
      context.search = text;
      if (!text) {
        const [pokemons1, pokemonsCount] = await getDataFRomAPI<[PokemonSearchInfo[], number]>(
          `?offset=${(context.page - 1) * context.limit}&limit=${context.limit}`
        );
        context.pokemons = pokemons1;
        context.totalFoundResults = pokemonsCount;
      } else {
        const [pokemons2] = await getDataFRomAPI<[PokemonSearchInfo[], number]>('?limit=1292');
        const foundPokemons = pokemons2.filter((el) =>
          el.name.toLowerCase().includes(text.toLowerCase())
        );
        context.totalFoundResults = foundPokemons.length;
        context.pokemons = foundPokemons.slice(
          (context.page - 1) * context.limit,
          (context.page - 1) * context.limit + context.limit
        );
      }
      setIsLoading(false);
    },
    [context]
  );

  useEffect(() => {
    context.readSearchParameters();
    if (context.search) writeSearchFromStorage(String(context.search));
    context.changeSearchParameters();
    search(context.search).catch((err) => console.error(err));
  }, [context, search]);

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
                  <Item pokemonInfo={el} key={el.name} doError={decideIsError()} />
                </ComponentsErrorBoundary>
              );
            })
          )}
        </>
      )}
      {!isLoading && context.pokemons.length > 0 && <Pagination searchMethod={search} />}
    </>
  );
}
