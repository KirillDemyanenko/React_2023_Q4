import React from 'react';
import { LoaderProps, LoaderState } from '../types';

export default class Loader extends React.Component<LoaderProps, LoaderState> {
  constructor(props: never) {
    super(props);
  }
  render() {
    return <div className="loader"></div>;
  }
}
