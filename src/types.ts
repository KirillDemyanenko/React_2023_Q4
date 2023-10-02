export type State = {
  pokemons: PokemonSearchInfo[];
};

export type Props = {
  name: string;
};

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
