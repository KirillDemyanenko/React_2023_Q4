import React from 'react';
import { SearchProps, SearchState } from '../../types';

export default class Search extends React.Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.state = { text: '' };
  }

  componentDidMount() {
    const savedText = localStorage.getItem('pokedexSearch') ?? '';
    this.setState({ text: savedText });
    this.props.searchMethod(savedText);
  }

  handleClick(): void {
    this.props.searchMethod(this.state.text);
  }

  saveToStorage(text: string) {
    this.setState({ text: text });
    localStorage.setItem('pokedexSearch', text);
  }

  clearInput() {
    this.saveToStorage('');
    this.props.searchMethod('');
  }

  render() {
    return (
      <>
        <div className="search">
          <div className="wrapper">
            <input
              type="text"
              value={this.state.text}
              onChange={(event) => this.saveToStorage(event.target.value)}
              placeholder={'Type something...'}
            />
            {this.state.text ? (
              <div className="clear" onClick={this.clearInput}>
                ❌
              </div>
            ) : (
              <></>
            )}
            <button onClick={this.handleClick}>search</button>
          </div>
        </div>
      </>
    );
  }
}
