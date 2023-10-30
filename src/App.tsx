import './App.css';
import './components/Loader/loader.style.css';
import './components/Item/item.style.css';
import './components/Search/search.style.css';
import './components/ErrorBoundary/error.style.css';
import React from 'react';
import { nanoid } from 'nanoid';
import type { PokemonSearchInfo, Props, State } from './types';
import Search from './components/Search/Search';
import Item from './components/Item/Item';
import notFound from './assets/ditto.png';
import Loader from './components/Loader/Loader';
import ComponentsErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

export default class App extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { pokemons: [], isLoading: true, doError: false };
    this.search = this.search.bind(this);
  }

  async getData(additional: string): Promise<PokemonSearchInfo[]> {
    this.setState((prevState) => ({ pokemons: [], isLoading: true, doError: prevState.doError }));
    return fetch('https://pokeapi.co/api/v2/pokemon'.concat(additional))
      .then((data) => data.json())
      .then((res) => res.results)
      .catch((err) => console.error(err));
  }

  decideIsError() {
    const { doError } = this.state;
    return Math.floor(Math.random() * (10 - 1)) + 1 === 5 && doError;
  }

  async search(text = '', canMakeError = false) {
    if (!text) {
      this.setState({
        pokemons: (await this.getData('?limit=20').catch((err) => console.error(err))) ?? [],
        isLoading: false,
        doError: canMakeError,
      });
    } else {
      const allPokemons =
        (await this.getData('?limit=2000').catch((err) => console.error(err))) ?? [];
      this.setState({
        pokemons: allPokemons.filter((el) => el.name.toLowerCase().includes(text.toLowerCase())),
        isLoading: false,
        doError: canMakeError,
      });
    }
  }

  render() {
    const { pokemons, isLoading } = this.state;
    return (
      <>
        <Search searchMethod={this.search} />
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
                  <ComponentsErrorBoundary updateMethod={this.search} key={nanoid(5)}>
                    <Item
                      pokemonInfo={el}
                      key={el.name}
                      id={el.name}
                      doError={this.decideIsError()}
                    />
                  </ComponentsErrorBoundary>
                );
              })
            )}
          </>
        )}
      </>
    );
  }
}
