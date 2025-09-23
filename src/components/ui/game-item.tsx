import Link from 'next/link';
import { Card, CardContent } from './card';
import { Game } from '@/types/game';
import { Club } from 'lucide-react';

const GameItem = (game: Game) => {
  return (
    <Link key={game.id} href={`/game/${game.id}`}>
      <Card>
        <CardContent className="flex justify-between items-center">
          <div className="flex gap-4">
            <span>#{game.id}</span>
            <span>{game.name}</span>
          </div>
          <div>
            <div className="flex gap-2">
              <Club size={20} />
              <span>{game?.cards.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GameItem;
