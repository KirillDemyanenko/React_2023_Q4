import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { ItemProps, PokemonInfo, TypesImages } from '../../types';
import images from '../../images';
import Loader from '../Loader/Loader';

export default function Item(props: ItemProps) {
  const { pokemonInfo, id, doError } = props;
  if (doError) throw new Error('Oops! I Did It Again...');
  const [info, setInfo] = useState({} as PokemonInfo);
  const [isLoad, setIsLoad] = useState(false);
  const [imgURL, setImgURL] = useState('');

  useEffect(() => {
    async function fetchData() {
      setInfo(await fetch(pokemonInfo.url).then((data) => data.json()));
    }
    fetchData().then(() => {
      setIsLoad(true);
      setImgURL(info.sprites.front_default ?? '');
    });
  }, [pokemonInfo, info]);

  return isLoad ? (
    <div className={`res ${info?.types?.at(0)?.type?.name ?? ''}`} key={id}>
      <h4>{pokemonInfo.name}</h4>
      <img src={imgURL} alt="img" />
      <div className="stats">
        <h5>Stats</h5>
        {info?.stats?.map((stat) => {
          return (
            <div className="stats-row" key={`stat-${stat.stat.name}`}>
              <p className="stats-info">{stat?.stat?.name}</p>
              <p className="stats-info">{stat?.base_stat}</p>
            </div>
          );
        })}
      </div>
      <div className="icon">
        {info?.types?.map((val) => {
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
