import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styles from './details.module.css';
import { PokemonInfo } from '../../types';
import Loader from '../Loader/Loader';

export default function Details() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [state, setItemState] = useState({ isLoad: false, info: {} as PokemonInfo, imgURL: '' });
  const [searchParams] = useSearchParams();

  const fetchData = useCallback(async () => {
    setItemState({ isLoad: false, info: {} as PokemonInfo, imgURL: '' });
    const infoData = (await fetch(import.meta.env.VITE_API_URL.concat('/', name?.toString())).then(
      (data) => data.json()
    )) as PokemonInfo;
    setItemState({ isLoad: true, info: infoData, imgURL: infoData.sprites.front_default ?? '' });
  }, [name]);

  const readSearchParameters = useCallback(() => {
    return [
      parseInt(searchParams.get('limit') || '20', 10),
      parseInt(searchParams.get('page') || '1', 10),
      searchParams.get('search') || '',
    ];
  }, [searchParams]);

  const closeDetail = () => {
    const [limit, page, search] = readSearchParameters();
    const query: string[][] = [
      ['page', page.toString()],
      ['limit', limit.toString()],
    ];
    if (search) query.push(['search', search.toString()]);
    const params = new URLSearchParams(query).toString();
    navigate(`/?${params}`);
  };

  useEffect(() => {
    fetchData().catch((err) => console.error(err));
  }, [fetchData]);

  return state.isLoad ? (
    <div className={styles.details} style={{ paddingTop: window.scrollY + 30 }}>
      <h4>{state.info.name}</h4>
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
      <button type="button" onClick={closeDetail}>
        Close
      </button>
    </div>
  ) : (
    <Loader isBig={false} />
  );
}
