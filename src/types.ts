export type Location = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type City = {
  name: string;
  location: Location;
};

export type Rating = 1 | 2 | 3 | 4 | 5;

export type Offer = {
  id: string;
  title: string;
  type: string;
  price: number;
  city: City;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: Rating;
  previewImage: string;
};

export type User = {
  name: string;
  avatarUrl: string;
  isPro: boolean;
};

export type ReviewData = {
  id: string;
  date: string;
  user: User;
  comment: string;
  rating: Rating;
};

export type SortType = 'popular' | 'price-low' | 'price-high' | 'rating';

export type AuthStatus = 'UNKNOWN' | 'AUTH' | 'NO_AUTH';

export type UserData = {
  email: string;
  avatarUrl: string;
  isPro: boolean;
};
