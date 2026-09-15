import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Trip,
  Destination,
  Expense,
  TravelNotification,
  UserProfile,
  PageView,
  ActivityItem,
  HotelBooking,
  TransportationBooking,
} from '../types';
import {
  INITIAL_DESTINATIONS,
  INITIAL_TRIPS,
  INITIAL_EXPENSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER_PROFILE,
} from '../data/mockData';

interface TravelContextType {
  trips: Trip[];
  activeTrip: Trip | null;
  setActiveTripId: (id: string) => void;
  destinations: Destination[];
  savedDestinationIds: string[];
  toggleFavoriteDestination: (id: string) => void;
  expenses: Expense[];
  notifications: TravelNotification[];
  userProfile: UserProfile;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  selectedDestinationId: string | null;
  setSelectedDestinationId: (id: string | null) => void;
  navigateToDestination: (id: string) => void;
  navigateToItinerary: (tripId: string) => void;

  // Trip operations
  addTrip: (newTrip: Partial<Trip>) => Trip;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addActivityToDay: (tripId: string, dayNumber: number, activity: Omit<ActivityItem, 'id'>) => void;
  toggleActivityCompleted: (tripId: string, dayNumber: number, activityId: string) => void;
  deleteActivity: (tripId: string, dayNumber: number, activityId: string) => void;
  addHotelToTrip: (tripId: string, hotel: Omit<HotelBooking, 'id'>) => void;
  addTransportationToTrip: (tripId: string, trans: Omit<TransportationBooking, 'id'>) => void;
  togglePackingItem: (tripId: string, itemId: string) => void;
  addPackingItem: (tripId: string, item: string, category: any) => void;

  // Expense operations
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  // Notification operations
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Profile operations
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('wandercraft_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('wandercraft_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // View state
  const [currentView, setCurrentView] = useState<PageView>('dashboard');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>('dest-kyoto');

  // Trips state
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('wandercraft_trips');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing trips from local storage:', e);
      }
    }
    return INITIAL_TRIPS;
  });

  useEffect(() => {
    localStorage.setItem('wandercraft_trips', JSON.stringify(trips));
  }, [trips]);

  // Active Trip ID
  const [activeTripId, setActiveTripId] = useState<string>(() => {
    return trips[0]?.id || 'trip-kyoto-autumn';
  });

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0] || null;

  // Destinations state
  const [destinations] = useState<Destination[]>(INITIAL_DESTINATIONS);

  // Saved / Favorites state
  const [savedDestinationIds, setSavedDestinationIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('wandercraft_saved_destinations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ['dest-kyoto', 'dest-amalfi', 'dest-banff'];
  });

  useEffect(() => {
    localStorage.setItem('wandercraft_saved_destinations', JSON.stringify(savedDestinationIds));
  }, [savedDestinationIds]);

  const toggleFavoriteDestination = (id: string) => {
    setSavedDestinationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Expenses state
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('wandercraft_expenses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_EXPENSES;
  });

  useEffect(() => {
    localStorage.setItem('wandercraft_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Notifications state
  const [notifications, setNotifications] = useState<TravelNotification[]>(INITIAL_NOTIFICATIONS);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('wandercraft_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USER_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('wandercraft_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  // Navigation helpers
  const navigateToDestination = (id: string) => {
    setSelectedDestinationId(id);
    setCurrentView('destination-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToItinerary = (tripId: string) => {
    setActiveTripId(tripId);
    setCurrentView('itinerary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trip operations
  const addTrip = (newTripData: Partial<Trip>): Trip => {
    const id = `trip-${Date.now()}`;
    const destination = destinations.find((d) => d.name.toLowerCase() === (newTripData.destinationName || '').toLowerCase());
    const coverImage = newTripData.coverImage || destination?.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';

    const trip: Trip = {
      id,
      title: newTripData.title || `Trip to ${newTripData.destinationName || 'New Horizon'}`,
      destinationId: destination?.id,
      destinationName: newTripData.destinationName || 'Undisclosed Destination',
      country: newTripData.country || destination?.country || 'Global',
      coverImage,
      startDate: newTripData.startDate || new Date().toISOString().split('T')[0],
      endDate: newTripData.endDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      status: newTripData.status || 'upcoming',
      travelers: newTripData.travelers || 2,
      travelerType: newTripData.travelerType || 'Couple',
      totalBudget: newTripData.totalBudget || 2500,
      spentBudget: 0,
      currency: newTripData.currency || 'USD',
      notes: newTripData.notes || '',
      hotels: newTripData.hotels || [],
      transportations: newTripData.transportations || [],
      days: newTripData.days || [
        {
          id: `day-${Date.now()}-1`,
          dayNumber: 1,
          date: newTripData.startDate || new Date().toISOString().split('T')[0],
          title: 'Arrival & Welcome Dinner',
          theme: 'First Impressions',
          activities: [
            {
              id: `act-${Date.now()}-1`,
              time: '02:00 PM',
              title: 'Check-in to Accommodations',
              location: 'City Center Hotel',
              category: 'Relaxation',
              cost: 0,
              duration: '1.5 hours',
              notes: 'Unpack and get oriented with the neighborhood.',
              completed: false,
            },
            {
              id: `act-${Date.now()}-2`,
              time: '06:30 PM',
              title: 'Introductory Neighborhood Walk & Dinner',
              location: 'Old Town Plaza',
              category: 'Food & Drink',
              cost: 45,
              duration: '2 hours',
              notes: 'Try the local culinary specialties.',
              completed: false,
            },
          ],
        },
      ],
      packingList: newTripData.packingList || [
        { id: `pack-1`, item: 'Passport & Travel Insurance', category: 'Documents', packed: false },
        { id: `pack-2`, item: 'Comfortable walking shoes', category: 'Clothing', packed: false },
        { id: `pack-3`, item: 'Phone charger & power bank', category: 'Electronics', packed: false },
      ],
      createdAt: new Date().toISOString(),
    };

    setTrips((prev) => [trip, ...prev]);
    setActiveTripId(trip.id);
    return trip;
  };

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    if (activeTripId === id) {
      const remaining = trips.filter((t) => t.id !== id);
      if (remaining.length > 0) {
        setActiveTripId(remaining[0].id);
      }
    }
  };

  const addActivityToDay = (tripId: string, dayNumber: number, activityData: Omit<ActivityItem, 'id'>) => {
    const activity: ActivityItem = {
      ...activityData,
      id: `act-${Date.now()}`,
    };

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updatedDays = trip.days.map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: [...day.activities, activity],
          };
        });
        return {
          ...trip,
          days: updatedDays,
        };
      })
    );
  };

  const toggleActivityCompleted = (tripId: string, dayNumber: number, activityId: string) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updatedDays = trip.days.map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: day.activities.map((act) =>
              act.id === activityId ? { ...act, completed: !act.completed } : act
            ),
          };
        });
        return { ...trip, days: updatedDays };
      })
    );
  };

  const deleteActivity = (tripId: string, dayNumber: number, activityId: string) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updatedDays = trip.days.map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: day.activities.filter((act) => act.id !== activityId),
          };
        });
        return { ...trip, days: updatedDays };
      })
    );
  };

  const addHotelToTrip = (tripId: string, hotelData: Omit<HotelBooking, 'id'>) => {
    const hotel: HotelBooking = {
      ...hotelData,
      id: `hotel-${Date.now()}`,
    };
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, hotels: [...t.hotels, hotel] } : t))
    );
  };

  const addTransportationToTrip = (tripId: string, transData: Omit<TransportationBooking, 'id'>) => {
    const trans: TransportationBooking = {
      ...transData,
      id: `trans-${Date.now()}`,
    };
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, transportations: [...t.transportations, trans] } : t))
    );
  };

  const togglePackingItem = (tripId: string, itemId: string) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        return {
          ...trip,
          packingList: trip.packingList.map((p) =>
            p.id === itemId ? { ...p, packed: !p.packed } : p
          ),
        };
      })
    );
  };

  const addPackingItem = (tripId: string, item: string, category: any) => {
    const newItem = {
      id: `pack-${Date.now()}`,
      item,
      category,
      packed: false,
    };
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, packingList: [...t.packingList, newItem] } : t))
    );
  };

  // Expense operations
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [expense, ...prev]);

    // Also update spent budget in the relevant trip
    if (expense.tripId) {
      setTrips((prev) =>
        prev.map((trip) => {
          if (trip.id === expense.tripId) {
            return {
              ...trip,
              spentBudget: (trip.spentBudget || 0) + expense.amount,
            };
          }
          return trip;
        })
      );
    }
  };

  const deleteExpense = (id: string) => {
    const toDelete = expenses.find((e) => e.id === id);
    if (toDelete && toDelete.tripId) {
      setTrips((prev) =>
        prev.map((trip) => {
          if (trip.id === toDelete.tripId) {
            return {
              ...trip,
              spentBudget: Math.max(0, (trip.spentBudget || 0) - toDelete.amount),
            };
          }
          return trip;
        })
      );
    }
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <TravelContext.Provider
      value={{
        trips,
        activeTrip,
        setActiveTripId,
        destinations,
        savedDestinationIds,
        toggleFavoriteDestination,
        expenses,
        notifications,
        userProfile,
        theme,
        toggleTheme,
        currentView,
        setCurrentView,
        selectedDestinationId,
        setSelectedDestinationId,
        navigateToDestination,
        navigateToItinerary,
        addTrip,
        updateTrip,
        deleteTrip,
        addActivityToDay,
        toggleActivityCompleted,
        deleteActivity,
        addHotelToTrip,
        addTransportationToTrip,
        togglePackingItem,
        addPackingItem,
        addExpense,
        deleteExpense,
        markNotificationRead,
        markAllNotificationsRead,
        updateUserProfile,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
