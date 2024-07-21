export interface UserCredentials {
  email: string | null;
  password: string | null;
}

export interface UserRegistration {
  name: string | null;
  email: string | null;
  password: string | null;
  avatar: string | null;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
  category: {
    id: number;
    name: string;
    image: string;
  };
  description: string;
  quantity: number;
}

export interface User {
  id: number;
  username: string;
  email: string | null;
  password: string | null;
  role: string;
}


export interface Category {
  id: number;
  name: string;
  image: string;
}