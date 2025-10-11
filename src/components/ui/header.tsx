'use client';

import { useUserContext } from '@/context/userContext';
import { Button } from './button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { user, logout } = useUserContext();
  const router = useRouter();

  return (
    <header className="px-50 pt-8 pb-5 flex justify-between items-center h-[100px]">
      <Link href={'/'}>
        <h1 className="text-3xl font-semibold">CardGame!</h1>
      </Link>
      {user ? (
        <div className="flex gap-5 items-center">
          <div className="flex flex-col">
            <span>{user.displayName}</span>
            <div className="flex gap-2 self-end">
              <Link href={`/profile/${user.name}`} className="underline">
                Ver perfil
              </Link>
              <button className="cursor-pointer underline" onClick={logout}>
                Sair
              </button>
            </div>
          </div>
          <div className="relative w-14 h-14 rounded-full overflow-hidden">
            <Image
              src={user.photoUrl}
              alt="Foto de Perfil"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="flex gap-5 items-center">
          <Button onClick={() => router.push('/register')}>Cadastre-se</Button>
          <Button onClick={() => router.push('/login')}>Login</Button>
        </div>
      )}
    </header>
  );
};

export default Header;
