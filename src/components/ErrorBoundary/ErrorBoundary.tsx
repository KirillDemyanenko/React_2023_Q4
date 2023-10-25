import React from 'react';
import { BoundaryProps, BoundaryState } from '../../types';

export default class ComponentsErrorBoundary extends React.Component<BoundaryProps, BoundaryState> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.handleClick = this.handleClick.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleClick(): void {
    this.props.updateMethod(localStorage.getItem('pokedexSearch') ?? '', false);
  }

  componentDidCatch(error: Error) {
    console.log(error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error">
          <h3>Something was wrong.</h3>
          <button onClick={this.handleClick}>Fix please...</button>
        </div>
      );
    }
    return this.props.children;
  }
}
