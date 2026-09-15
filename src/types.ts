export type TripStatus = 'upcoming' | 'ongoing' | 'completed' | 'draft';

export type ActivityCategory = 'Sightseeing' | 'Food & Drink' | 'Adventure' | 'Relaxation' | 'Culture' | 'Shopping' | 'Transport';

export interface ActivityItem {
  id: string;
  time: string;
  title: string;
  location: string;
  category: ActivityCategory;
  cost: number;
  duration: string;
  notes?: string;
  completed?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type Activity = ActivityItem;

export interface DayPlan {
  id: string;
  dayNumber: number;
  date: string;
  title: string;
  theme?: string;
  activities: ActivityItem[];
}

export interface HotelBooking {
  id: string;
  name: string;
  checkIn: string;
  checkOut: string;
  confirmationCode?: string;
  address: string;
  roomType: string;
  pricePerNight: number;
  totalCost: number;
  rating: number;
  status: 'Booked' | 'Considering';
  notes?: string;
}

export interface TransportationBooking {
  id: string;
  type: 'Flight' | 'Train' | 'Rental Car' | 'Ferry' | 'Private Transfer';
  provider: string;
  departure: string;
  departureTime: string;
  arrival: string;
  arrivalTime: string;
  reference: string;
  cost: number;
  status: 'Confirmed' | 'Planned';
}

export interface PackingItem {
  id: string;
  item: string;
  category: 'Clothing' | 'Electronics' | 'Documents' | 'Toiletries' | 'Essentials' | 'Misc';
  packed: boolean;
}

export interface Trip {
  id: string;
  title: string;
  destinationId?: string;
  destinationName: string;
  country: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  travelers: number;
  travelerType: 'Solo' | 'Couple' | 'Family' | 'Friends';
  totalBudget: number;
  spentBudget: number;
  currency: string;
  notes: string;
  hotels: HotelBooking[];
  transportations: TransportationBooking[];
  days: DayPlan[];
  packingList: PackingItem[];
  createdAt: string;
}

export interface DestinationWeather {
  tempC: number;
  tempF: number;
  condition: string;
  icon: string;
  humidity: number;
  rainChance: number;
  uvIndex: number;
  forecast: {
    day: string;
    tempC: number;
    condition: string;
    rainChance: number;
  }[];
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: 'Asia' | 'Europe' | 'North America' | 'South America' | 'Africa' | 'Oceania';
  category: 'Cultural & Historic' | 'Beaches & Coastal' | 'Mountain & Nature' | 'Urban & Modern' | 'Culinary & Wine' | 'Adventure';
  rating: number;
  reviewCount: number;
  imageUrl: string;
  gallery: string[];
  description: string;
  bestTimeToVisit: string;
  avgCostPerDay: number;
  currency: string;
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  topAttractions: {
    name: string;
    type: string;
    rating: number;
    description: string;
  }[];
  localDishes: string[];
  weather: DestinationWeather;
}

export type ExpenseCategory = 'Accommodation' | 'Flights & Transport' | 'Food & Dining' | 'Activities' | 'Shopping' | 'Misc';

export interface Expense {
  id: string;
  tripId?: string;
  tripName?: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  currency?: string;
  date: string;
  paymentMethod?: 'Credit Card' | 'Debit Card' | 'Cash' | 'Apple Pay / Google Pay';
  receiptNote?: string;
  notes?: string;
}

export interface TravelNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'reminder' | 'tip' | 'weather' | 'budget';
  read: boolean;
  tripId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  homeAirport: string;
  currency: string;
  preferredPace: 'Relaxed' | 'Balanced' | 'Fast-Paced';
  dietaryPreferences: string[];
  travelInterests: string[];
  bio: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedPrompts?: string[];
  actionPayload?: {
    type: 'itinerary' | 'destination' | 'expense';
    data: any;
  };
}

export type PageView =
  | 'dashboard'
  | 'explore'
  | 'destination-details'
  | 'my-trips'
  | 'trip-planner'
  | 'itinerary'
  | 'budget'
  | 'saved-places'
  | 'ai-assistant'
  | 'profile';
