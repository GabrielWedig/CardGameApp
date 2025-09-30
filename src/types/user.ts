export interface User {
  id: number;
  displayName: string;
  level: number;
  photo: string;
}

export interface SearchUser extends User {
  name: string;
  nacionalityPhoto: string;
  requestId?: number;
  isFriend?: boolean;
  canAnswer?: boolean;
}
