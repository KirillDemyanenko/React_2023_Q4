import './App.css';
import React from 'react';
import { PokemonSearchInfo, Props, State } from './types';
import Search from './components/Search';
import Item from './components/Item';
import notFound from './assets/ditto.png';
import Loader from './components/Loader';

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { pokemons: [], isLoading: true };
    this.search = this.search.bind(this);
  }

  async getData(additional: string): Promise<PokemonSearchInfo[]> {
    this.setState({ pokemons: [], isLoading: true });
    return await fetch('https://pokeapi.co/api/v2/pokemon'.concat(additional))
      .then((data) => data.json())
      .then((res) => res.results);
  }

  async search(text = '') {
    if (text === '') {
      this.setState({ pokemons: await this.getData('?limit=20'), isLoading: false });
    } else {
      const allPokemons = await this.getData('?limit=2000');
      this.setState({
        pokemons: allPokemons.filter((el) => el.name.toLowerCase().includes(text.toLowerCase())),
        isLoading: false,
      });
    }
  }
  render() {
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
                return <Item pokemonInfo={el} key={el.name} id={el.name} />;
              })
            )}
          </>
        )}
      </>
    );
  }
}
