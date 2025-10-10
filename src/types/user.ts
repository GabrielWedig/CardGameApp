export interface User {
  id: number;
  name: string;
  displayName: string;
  photo: string;
}

export interface SearchUser extends User {
  nationalityPhoto: string;
  requestId?: number;
}

export interface UserProfile extends User {
  nationalityPhoto: string;
  about: string;
  me: boolean;
  friend: boolean;
  requested: boolean;
  requestedByMe: boolean;
  canRequest: boolean;
  stats: UserStats;
  requestId?: number;
}

interface UserStats {
  since: number;
}
