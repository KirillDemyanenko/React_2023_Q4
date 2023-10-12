import React from 'react';
import { SearchProps, SearchState } from '../../types';

export default class Search extends React.Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = { text: '' };
  }

  componentDidMount() {
    const savedText = localStorage.getItem('pokedexSearch') || '';
    this.setState({ text: savedText });
    this.props.searchMethod(savedText);
  }

  handleClick(): void {
    this.props.searchMethod(this.state.text);
  }

  saveToStarage(text: string) {
    this.setState({ text: text });
    localStorage.setItem('pokedexSearch', text);
  }

  render() {
    return (
      <>
        <div className="search">
          <input
            type="text"
            value={this.state.text}
            onChange={(event) => this.saveToStarage(event.target.value)}
            placeholder={'Type something...'}
          />
          <button onClick={this.handleClick}>search</button>
        </div>
      </>
    );
  }
}
