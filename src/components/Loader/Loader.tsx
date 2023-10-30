import React from 'react';
import { LoaderProps } from '../../types';

export default function Loader(props: LoaderProps) {
  const { isBig } = props;
  return isBig ? (
    <div className="loader" />
  ) : (
    <div className="lds-ellipsis">
      <div />
      <div />
      <div />
      <div />
    </div>
  );
}
