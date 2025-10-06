export interface User {
  id: number;
  name: string;
  displayName: string;
  level: number;
  photo: string;
}

export interface SearchUser extends User {
  nacionalityPhoto: string;
  requestId?: number;
}

export interface UserProfile extends User {
  nacionalityPhoto: string;
}
