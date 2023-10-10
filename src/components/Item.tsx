import React from 'react';
import { ItemProps, ItemState, PokemonInfo, TypesImages } from '../types';
import image from '../assets/load.gif';
import { images } from '../images';
import { nanoid } from 'nanoid';

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
      <div className={`res ${this.info?.types?.at(0)?.type?.name ?? ''}`} key={this.props.id}>
        <h4>{this.props.pokemonInfo.name}</h4>
        <img src={this.state.isLoad ? this.state.imgURL : image} alt="img" />
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
        <div className="icon">
          {this.info?.types?.map((val) => {
            const type = val.type.name;
            return (
              <img
                src={images[type as keyof TypesImages]}
                key={nanoid(5)}
                alt={type}
                className={type}
              />
            );
          }) ?? 'loading'}
        </div>
      </div>
    );
  }
}
