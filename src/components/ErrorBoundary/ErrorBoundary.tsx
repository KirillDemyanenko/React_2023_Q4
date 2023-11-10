import React from 'react';
import { BoundaryProps, BoundaryState } from '../../types';
import styles from './error.module.css';
import { readSearchFromStorage } from '../../helpers/workWithStorage';

export default class ComponentsErrorBoundary extends React.PureComponent<
  BoundaryProps,
  BoundaryState
> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.handleClick = this.handleClick.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(error.message);
  }

  handleClick(): void {
    const { updateMethod } = this.props;
    updateMethod(readSearchFromStorage(), false);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <div className={styles.error}>
          <h3>Something was wrong.</h3>
          <button type="button" onClick={this.handleClick}>
            Fix please...
          </button>
        </div>
      );
    }
    return children;
  }
}
