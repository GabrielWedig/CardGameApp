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
          <div className="flex flex-col gap-1 items-end">
            <span className='pr-4'>{user.displayName}</span>
            <div className="flex gap-2 self-end">
              <Button
                variant="ghost"
                onClick={() => router.push(`/profile/${user.name}`)}
              >
                Ver perfil
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
              >
                Sair
              </Button>
              <Link href={``} className="underline"></Link>
              <button
                className="cursor-pointer underline"
                onClick={logout}
              ></button>
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
