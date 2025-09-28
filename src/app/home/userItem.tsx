import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types/user';
import Image from 'next/image';
import Link from 'next/link';

const UserItem = (user: User) => {
  return (
    // <Link href={`profile/${user.name}`}>
      <Card>
        <CardContent className="">
          <span>{user.level}</span>
          <div>
            <span>{user.displayName}</span>
            <span>{user.name}</span>
          </div>
          <Image
            src={user.photo}
            alt="Foto de Perfil"
            width={40}
            height={40}
            priority
            className="w-auto h-auto rounded-full"
          />
          {!user.isFriend && <Button>Solicitar amizade</Button>}
        </CardContent>
      </Card>
    // </Link>
  );
};

export default UserItem;
