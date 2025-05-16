
// Types for our spider tracking application

export interface Spider {
  id: number;
  scientificName: string;
  commonName: string;
  family: string;
  description: string;
  habitat: string;
  imageUrl: string;
  dangerLevel: DangerLevel;
  size: string;
  region: string[];
}

export enum DangerLevel {
  Harmless = "Harmless",
  MildlyVenomous = "Mildly Venomous",
  Venomous = "Venomous",
  Dangerous = "Dangerous"
}

export interface Encounter {
  id: string;
  spiderId: number;
  date: Date;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  companions: string[];
  notes: string;
  photos?: string[];
}
