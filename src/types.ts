export type State = {
  pokemons: PokemonSearchInfo[];
};

export type Props = NonNullable<unknown>;

export type PokemonSearchInfo = {
  name: string;
  url: string;
};

export type PokemonsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonSearchInfo[];
};

export type SearchProps = {
  searchText: string;
};

export type ItemProps = {
  pokemonInfo: PokemonSearchInfo;
  key: number;
};
