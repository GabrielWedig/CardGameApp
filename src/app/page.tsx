import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { GAMES } from './backend';

const Home = () => {
  return (
    <section className="py-10">
      <h1 className="mb-5 text-3xl font-semibold">Jogos</h1>
      <div className="flex flex-col gap-2">
        {GAMES.map((game) => (
          <Link key={game.id} href={`/game/${game.id}`}>
            <Card>
              <CardContent>{game.name}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Home;
