export interface User {
  id: number;
  name: string;
  displayName: string;
  photoUrl: string;
}

export interface SearchUser extends User {
  nationalityImageUrl: string;
  requestId?: number;
}

export interface UserProfile extends User {
  nationalityImageUrl: string;
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
