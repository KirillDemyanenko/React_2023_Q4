import React from 'react';
import { LoaderProps, LoaderState } from '../../types';
import ComponentsErrorBoundary from '../ErrorBoundary/ErrorBoundary';

export default class Loader extends React.Component<LoaderProps, LoaderState> {
  constructor(props: LoaderProps) {
    super(props);
  }
  render() {
    return this.props.isBig ? (
      <ComponentsErrorBoundary>
        <div className="loader"></div>
      </ComponentsErrorBoundary>
    ) : (
      <ComponentsErrorBoundary>
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </ComponentsErrorBoundary>
    );
  }
}
