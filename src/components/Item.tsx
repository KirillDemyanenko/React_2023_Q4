import React from 'react';
import { ItemProps, State } from '../types';

export default class Item extends React.Component<ItemProps, State> {
  constructor(props: ItemProps) {
    super(props);
  }

  render() {
    return (
      <div className="res" key={this.props.key}>
        <h4>{this.props.pokemonInfo.name}</h4>
        <a href={this.props.pokemonInfo.url}>more details</a>
      </div>
    );
  }
}
