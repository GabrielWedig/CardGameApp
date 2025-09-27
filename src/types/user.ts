export interface BasicUser {
  id: number;
  displayName: string;
  level: number;
  photo: string;
  name: string;
  isFriend?: boolean;
}

export interface User {
  id: number;
  displayName: string;
  level: number;
  photo: string;
  friends: BasicUser[];
}
