import './App.css';
import React from 'react';
import { PokemonSearchInfo, Props, State } from './types';
import Search from './components/Search';
import Item from './components/Item';

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { pokemons: [] };
  }

  async getData(additional: string): Promise<PokemonSearchInfo[]> {
    return await fetch('https://pokeapi.co/api/v2/pokemon'.concat(additional))
      .then((data) => data.json())
      .then((res) => res.results);
  }

  async componentDidMount(): Promise<void> {
    this.setState({ pokemons: await this.getData('?limit=20') });
  }

  async getPokemonInfo(name: string) {
    return await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((data) => data.json());
  }

  render() {
    return (
      <>
        <Search searchText={''} />
        {this.state.pokemons.map((el, i) => {
          return <Item pokemonInfo={el} key={i} />;
        })}
      </>
    );
  }
}
