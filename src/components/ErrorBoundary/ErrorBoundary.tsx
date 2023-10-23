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
    this.setState({ hasError: false });
  }

  componentDidCatch(error: Error) {
    console.log(error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error">
          <h3>Everything went to hell. Let&apos;s go our separate ways.</h3>
          <button onClick={this.handleClick}>
            React, brother, make everything beautiful as it was. I ask you brotherly...
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
