import { Button } from './button';
import Image from 'next/image';

const Header = () => {
  const isLogged = true;

  return (
    <header className="px-50 pt-8 pb-5 flex justify-between items-center">
      <h1 className="text-3xl font-semibold">CardGame!</h1>
      {isLogged ? (
        <div className="flex gap-5 items-center">
          <div className="flex flex-col">
            <span>Nome Completo</span>
            <span>Lvl. 25</span>
          </div>
          <Image
            src="https://37assets.37signals.com/svn/765-default-avatar.png"
            alt="Foto de Perfil"
            width={40}
            height={40}
            priority
            className="w-auto h-auto rounded-full"
          />
        </div>
      ) : (
        <div className="flex gap-5 items-center">
          <Button>Cadastre-se</Button>
          <Button>Login</Button>
        </div>
      )}
    </header>
  );
};

export default Header;
