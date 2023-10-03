import React, { RefObject } from 'react';
import { SearchProps, State } from '../types';

export default class Search extends React.Component<SearchProps, State> {
  search: RefObject<HTMLInputElement>;
  constructor(props: SearchProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.search = React.createRef();
  }

  async handleClick(): Promise<void> {
    this.props.searchMethod(this.search.current?.value || '');
  }

  render() {
    return (
      <>
        <div className="search">
          <input type="text" ref={this.search} placeholder={'Type something...'} />
          <button onClick={this.handleClick}>search</button>
        </div>
      </>
    );
  }
}
