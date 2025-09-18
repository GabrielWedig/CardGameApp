import Image from 'next/image';
import { COUNTRIES } from './countries';

const URL_PREFIX =
  'https://www.geoguessr.com/images/resize:fit:0:256/gravity:ce/plain/seterra/game-area/';

export default function Home() {
  return (
    <>
      <main className="flex justify-center items-center min-h-screen">
        <h1>Advinhe a bandeira!</h1>
        {COUNTRIES.map((country) => (
          <div key={country.id}>
            <Image
              src={`${URL_PREFIX}${country.image}`}
              alt="Bandeira"
              width={400}
              height={300}
            />
          </div>
        ))}
      </main>
    </>
  );
}
