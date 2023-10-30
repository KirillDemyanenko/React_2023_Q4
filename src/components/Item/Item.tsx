import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { ItemProps, PokemonInfo, TypesImages } from '../../types';
import images from '../../images';
import Loader from '../Loader/Loader';

export default function Item(props: ItemProps) {
  const { pokemonInfo, id, doError } = props;
  if (doError) throw new Error('Oops! I Did `It Again...');
  const [state, setItemState] = useState({ isLoad: false, info: {} as PokemonInfo, imgURL: '' });

  useEffect(() => {
    async function fetchData() {
      const infoData = (await fetch(pokemonInfo.url).then((data) => data.json())) as PokemonInfo;
      setItemState({ isLoad: true, info: infoData, imgURL: infoData.sprites.front_default ?? '' });
    }
    fetchData().catch((err) => console.error(err));
  }, [pokemonInfo, state]);

  return state.isLoad ? (
    <div className={`res ${state.info?.types?.at(0)?.type?.name ?? ''}`} key={id}>
      <h4>{pokemonInfo.name}</h4>
      <img src={state.imgURL} alt="img" />
      <div className="stats">
        <h5>Stats</h5>
        {state.info?.stats?.map((stat) => {
          return (
            <div className="stats-row" key={`stat-${stat.stat.name}`}>
              <p className="stats-info">{stat?.stat?.name}</p>
              <p className="stats-info">{stat?.base_stat}</p>
            </div>
          );
        })}
      </div>
      <div className="icon">
        {state.info?.types?.map((val) => {
          const type = val.type.name;
          return (
            <img
              src={images[type as keyof TypesImages]}
              key={nanoid(5)}
              alt={type}
              className={type}
              title={type}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <Loader isBig={false} />
  );
}
