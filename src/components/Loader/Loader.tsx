import React from 'react';
import { LoaderProps, LoaderState } from '../../types';

export default class Loader extends React.Component<LoaderProps, LoaderState> {
  constructor(props: LoaderProps) {
    super(props);
  }
  render() {
    return this.props.isBig ? (
      <div className="loader"></div>
    ) : (
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }
}
