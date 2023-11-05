import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { ItemProps, PokemonInfo, TypesImages } from '../../types';
import images from '../../images';
import Loader from '../Loader/Loader';
import noImage from '../../assets/no-image.svg';

export default function Item(props: ItemProps) {
  const { pokemonInfo, id, doError } = props;
  const navigate = useNavigate();
  if (doError) throw new Error('Oops! I Did `It Again...');
  const [state, setItemState] = useState({ isLoad: false, info: {} as PokemonInfo, imgURL: '' });
  const [searchParams] = useSearchParams();

  const fetchData = useCallback(async () => {
    const infoData = (await fetch(pokemonInfo.url).then((data) => data.json())) as PokemonInfo;
    setItemState({ isLoad: true, info: infoData, imgURL: infoData.sprites.front_default ?? '' });
  }, [pokemonInfo.url]);

  const readSearchParameters = useCallback(() => {
    return [
      parseInt(searchParams.get('limit') || '20', 10),
      parseInt(searchParams.get('page') || '1', 10),
      searchParams.get('search') || '',
    ];
  }, [searchParams]);

  useEffect(() => {
    fetchData().catch((err) => console.error(err));
  }, [fetchData]);

  const openDetail = () => {
    const [limit, page, search] = readSearchParameters();
    const query: string[][] = [
      ['page', page.toString()],
      ['limit', limit.toString()],
    ];
    if (search) query.push(['search', search.toString()]);
    const params = new URLSearchParams(query).toString();
    navigate(`/detail/${state.info.name}?${params}`);
  };

  return state.isLoad ? (
    <div
      role="link"
      onClick={openDetail}
      onKeyDown={openDetail}
      tabIndex={0}
      className={`res ${state.info?.types?.at(0)?.type?.name ?? ''}`}
      key={id}
    >
      <h4>{pokemonInfo.name}</h4>
      <img src={state.imgURL || noImage} alt="img" />
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
