export interface INavbar {
  hamburgerMenuIsOpen: boolean;
}

export interface ICardHome {
  title: string;
  paragraph: string;
  button: string;
  image: string;
  link: string;
}

export interface ICardVehicle {
  name: string;
  model: string;
  image: string;
  title: string;
  firstDescription: string;
  secondDescription: string;
  purchaseParagraph: string;
  price: number;
  avaible: boolean;
}

export interface ICardAuction {
  name: string;
  model: string;
  image: string;
  title: string;
  firstDescription: string;
  secondDescription: string;
  isStarted: boolean;
  startedAt: bigint;
  willEndAt: bigint;
  winningBid: bigint;
  ownerBid: string;
}

export interface IFormVehicleInfo {
  name: string;
  model: string;
  price: number | string;
}

export interface IFormAuctionVehicleInfo {
  name: string;
  model: string;
}

export interface IVehicle {
  currentVehicle: number;
}

export interface IVehicleInfo {
  id: string;
  name: string;
  model: string;
  price: number;
  available: boolean;
  owner: string;
}
