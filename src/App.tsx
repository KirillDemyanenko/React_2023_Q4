import './App.css';
import './components/Loader/loader.style.css';
import './components/Item/item.style.css';
import './components/Search/search.style.css';
import './components/ErrorBoundary/error.style.css';
import React from 'react';
import { PokemonSearchInfo, Props, State } from './types';
import Search from './components/Search/Search';
import Item from './components/Item/Item';
import notFound from './assets/ditto.png';
import Loader from './components/Loader/Loader';
import ComponentsErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { nanoid } from 'nanoid';

export default class App extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { pokemons: [], isLoading: true, doError: false };
    this.search = this.search.bind(this);
  }

  decideIsError() {
    return Math.floor(Math.random() * (10 - 1)) + 1 === 5 && this.state.doError;
  }

  async getData(additional: string): Promise<PokemonSearchInfo[]> {
    this.setState({ pokemons: [], isLoading: true, doError: this.state.doError });
    return await fetch('https://pokeapi.co/api/v2/pokemon'.concat(additional))
      .then((data) => data.json())
      .then((res) => res.results)
      .catch((err) => console.error(err));
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
    try {
      return (
        <>
          <Search searchMethod={this.search} />
          {this.state.isLoading ? (
            <Loader isBig={true} />
          ) : (
            <>
              {this.state.pokemons.length === 0 ? (
                <div className={'not-found'}>
                  <img src={notFound} alt="not found" />
                  <h3>Nothing was found...</h3>
                </div>
              ) : (
                this.state.pokemons.map((el) => {
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
    } catch (err) {
      console.error(err);
    }
  }
}
