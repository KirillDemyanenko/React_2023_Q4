import './App.css';
import React, { RefObject } from 'react';
import { PokemonSearchInfo, Props, State } from './types';

export default class App extends React.Component<Props, State> {
  search: RefObject<HTMLInputElement>;
  constructor(props: Props) {
    super(props);
    this.state = { pokemons: [] };
    this.handleClick = this.handleClick.bind(this);
    this.search = React.createRef();
  }

  async getData(additional: string): Promise<PokemonSearchInfo[]> {
    return await fetch('https://pokeapi.co/api/v2/pokemon'.concat(additional))
      .then((data) => data.json())
      .then((res) => res.results);
  }

  async componentDidMount(): Promise<void> {
    this.setState({ pokemons: await this.getData('?limit=10') });
  }

  async getPokemonInfo(name: string) {
    return await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((data) => data.json());
  }

  async handleClick(): Promise<void> {
    this.setState({ pokemons: await this.getData('?limit=10') });
  }

  render() {
    return (
      <>
        <div className="search">
          <input type="text" ref={this.search} placeholder={'Type something...'} />
          <button onClick={this.handleClick}>search</button>
        </div>
        {this.state.pokemons.map((el, i) => {
          return (
            <div className="res" key={i}>
              <h4>{el.name}</h4>
              <a href={el.url}>more info</a>
            </div>
          );
        })}
      </>
    );
  }
}
