import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { ItemProps, PokemonInfo, TypesImages } from '../../types';
import images from '../../images';
import Loader from '../Loader/Loader';
import noImage from '../../assets/no-image.svg';
import styles from './item.module.css';
import getPokemonByURL from '../../api/getDataFRomAPI';

export default function Item(props: ItemProps) {
  const { pokemonInfo, doError } = props;
  const navigate = useNavigate();
  const [state, setItemState] = useState({ isLoad: false, info: {} as PokemonInfo, imgURL: '' });
  const [searchParams] = useSearchParams();

  const readSearchParameters = useCallback(() => {
    return [
      parseInt(searchParams.get('limit') || '20', 10),
      parseInt(searchParams.get('page') || '1', 10),
      searchParams.get('search') || '',
    ];
  }, [searchParams]);

  useEffect(() => {
    if (doError) throw new Error('Oops! I Did `It Again...');
    getPokemonByURL<PokemonInfo>(pokemonInfo.name).then((pokemonData) => {
      setItemState({
        isLoad: true,
        info: pokemonData,
        imgURL: pokemonData.sprites.front_default ?? '',
      });
    });
  }, [doError, pokemonInfo.name]);

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
      className={`${styles.res} ${styles[state.info?.types?.at(0)?.type?.name ?? '']}`}
    >
      <h4>{pokemonInfo.name}</h4>
      <img src={state.imgURL || noImage} alt="img" />
      <div className={styles.stats}>
        <h5>Stats</h5>
        {state.info?.stats?.map((stat) => {
          return (
            <div className={styles.statsRow} key={`stat-${stat.stat.name}`}>
              <p className={styles.statsInfo}>{stat?.stat?.name}</p>
              <p className={styles.statsInfo}>{stat?.base_stat}</p>
            </div>
          );
        })}
      </div>
      <div className={styles.icon}>
        {state.info?.types?.map((val) => {
          const type = val.type.name;
          return (
            <img
              src={images[type as keyof TypesImages]}
              key={nanoid(5)}
              alt={type}
              className={styles[type]}
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
