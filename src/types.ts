import { UseFormRegister, FieldErrors } from 'react-hook-form';

export interface LocationData {
  lat?: number;
  lon?: number;
  neighborhood?: string;
  municipality?: string;
}

export interface PropertyData {
  propertyType: string;
  canton: string;
  address: string;
  postalCode: string;
  city: string;
  location?: LocationData;
  surface: number;
  yearBuilt: number;
  rooms: number;
  floors?: number;
  bathrooms: number;
  buildingUnits?: number;
  unitsRooms?: number;
  hasBalcony: boolean;
  hasTerrace: boolean;
  view: string;
}

export interface PriceEstimate {
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  pricePerM2: number;
  regionalPricePerM2: number;
}

export interface PropertyFormProps {
  register: UseFormRegister<PropertyData>;
  handleSubmit: any;
  onSubmit: (data: PropertyData) => void;
  errors: FieldErrors<PropertyData>;
}