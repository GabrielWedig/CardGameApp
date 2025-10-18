import { Card } from './card';

export interface Game {
  id: number;
  name: string;
  cards: Card[];
}

export interface EditGame {
  id: number;
  name: string;
  visibility: GameVisibility;
}

type GameVisibility = 'public' | 'private' | 'friends';
