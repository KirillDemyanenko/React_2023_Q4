import React from 'react';
import { LoaderProps } from '../../types';
import styles from './loader.module.css';

export default function Loader(props: LoaderProps) {
  const { isBig } = props;
  return isBig ? (
    <div className={styles.loader} />
  ) : (
    <div className={styles.ldsEllipsis}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
}
