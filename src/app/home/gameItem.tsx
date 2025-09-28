import Link from 'next/link';
import { Game } from '@/types/game';
import { Club } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const GameItem = (game: Game) => {
  return (
    <Link href={`/game/${game.id}`}>
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
