import React from 'react';
import { ItemProps, ItemState, PokemonInfo, TypesImages } from '../../types';
import { images } from '../../images';
import { nanoid } from 'nanoid';
import Loader from '../Loader/Loader';

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
    return this.state.isLoad ? (
      <div className={`res ${this.info?.types?.at(0)?.type?.name ?? ''}`} key={this.props.id}>
        <h4>{this.props.pokemonInfo.name}</h4>
        <img src={this.state.imgURL} alt="img" />
        <div className="stats">
          <h5>Stats</h5>
          {this.info?.stats?.map((stat) => {
            return (
              <div className={'stats-row'} key={`stat-${stat.stat.name}`}>
                <p className={'stats-info'}>{stat?.stat?.name}</p>
                <p className={'stats-info'}>{stat?.base_stat}</p>
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
          })}
        </div>
      </div>
    ) : (
      <Loader isBig={false} />
    );
  }
}
