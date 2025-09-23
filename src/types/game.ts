import { Card } from './card';

export interface Game {
  id: number;
  name: string;
  cards: Card[];
}
