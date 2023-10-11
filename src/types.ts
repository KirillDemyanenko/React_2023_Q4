export type State = {
  pokemons: PokemonSearchInfo[];
  isLoading: boolean;
};

export type SearchState = {
  text: string;
};

export type LoaderState = Record<string, never>;

export type SearchProps = {
  searchMethod: (text: string) => void;
};

export type ItemState = {
  isLoad: boolean;
  imgURL: string;
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

export type LoaderProps = {
  isBig: boolean;
};

export type ItemProps = {
  pokemonInfo: PokemonSearchInfo;
  key: string;
  id: string;
};

export type Ability = {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
};

export type GameIndice = {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
};

type Stats = {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
};

export type Types = {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};

type Version = {
  level_learned_at: number;
  move_learn_method: {
    name: string;
    url: string;
  };
  version_group: {
    name: string;
    url: string;
  };
};

type VersionDetail = {
  rarity: number;
  version: {
    name: string;
    url: string;
  };
};

type HeldItem = {
  item: {
    name: string;
    url: string;
  };
  version_details: VersionDetail[];
};

type Sprites = {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
};

export type PokemonInfo = {
  abilities: Ability[];
  base_experience: number;
  forms: [
    {
      name: string;
      url: string;
    },
  ];
  game_indices: GameIndice[];
  height: number;
  held_items: HeldItem[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: [
    {
      move: {
        name: string;
        url: string;
      };
      version_group_details: Version[];
    },
  ];
  name: string;
  order: number;
  past_types: [];
  species: {
    name: string;
    url: string;
  };
  sprites: {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    other: {
      dream_world: Sprites;
      home: Sprites;
      'official-artwork': Sprites;
    };
    versions: {
      'generation-i': {
        'red-blue': Sprites;
        yellow: Sprites;
      };
      'generation-ii': {
        crystal: Sprites;
        gold: Sprites;
        silver: Sprites;
      };
      'generation-iii': {
        emerald: Sprites;
        'firered-leafgreen': Sprites;
        'ruby-sapphire': Sprites;
      };
      'generation-iv': {
        'diamond-pearl': Sprites;
        'heartgold-soulsilver': Sprites;
        platinum: Sprites;
      };
      'generation-v': {
        'black-white': {
          animated: Sprites;
          back_default: string | null;
          back_female: string | null;
          back_shiny: string | null;
          back_shiny_female: string | null;
          front_default: string | null;
          front_female: string | null;
          front_shiny: string | null;
          front_shiny_female: string | null;
        };
      };
      'generation-vi': {
        'omegaruby-alphasapphire': Sprites;
        'x-y': Sprites;
      };
      'generation-vii': {
        icons: Sprites;
        'ultra-sun-ultra-moon': Sprites;
      };
      'generation-viii': {
        icons: Sprites;
      };
    };
  };
  stats: Stats[];
  types: Types[];
  weight: number;
};

export type TypesImages = {
  bug: string;
  electric: string;
  water: string;
  dragon: string;
  fairy: string;
  fighting: string;
  fire: string;
  flying: string;
  ghost: string;
  grass: string;
  ground: string;
  ice: string;
  normal: string;
  dark: string;
  poison: string;
  psychic: string;
  rock: string;
  steel: string;
};
