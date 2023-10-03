import React from 'react';
import { ItemProps, ItemState, PokemonInfo } from '../types';
import image from '../assets/load.gif';
export default class Item extends React.Component<ItemProps, ItemState> {
  info: PokemonInfo = {} as PokemonInfo;
  constructor(props: ItemProps) {
    super(props);
    this.state = { isLoad: false, imgURL: '' };
  }

  async componentDidMount() {
    this.info = await fetch(this.props.pokemonInfo.url).then((data) => data.json());
    this.setState({ isLoad: true, imgURL: this.info.sprites.front_default as string });
  }

  render() {
    return (
      <div className="res" key={this.props.id}>
        <h4>{this.props.pokemonInfo.name}</h4>
        <img src={this.state.isLoad ? this.state.imgURL : image} alt="img" />
        <p>Height: {this.info.height || 'Loading...'}</p>
        <p>Weight: {this.info.weight || 'Loading...'}</p>
        <div className="stats">
          <h5>Stats</h5>
          {this.info?.stats?.map((stat) => {
            return (
              <div className={'stats-row'} key={`stat-${stat.stat.name}`}>
                <p className={'stats-info'}>{stat.stat?.name || 'Loading'}</p>
                <p className={'stats-info'}>{stat?.base_stat || 'Loading'}</p>
              </div>
            );
          })}
        </div>
        <a href={this.props.pokemonInfo.url}>more details</a>
      </div>
    );
  }
}
