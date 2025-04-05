import React, { createContext, useContext, useState, useEffect } from 'react';
import { CalendarEvent, generateMockEvents, createEvent, updateEvent, deleteEvent } from '../services/calendarService';

interface CalendarContextType {
  events: CalendarEvent[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  editEvent: (event: CalendarEvent) => void;
  removeEvent: (id: string) => void;
  view: 'day' | 'week' | 'month' | 'agenda';
  setView: (view: 'day' | 'week' | 'month' | 'agenda') => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month' | 'agenda'>('week');

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      try {
        // Parse the stringified events and convert string dates back to Date objects
        const parsedEvents = JSON.parse(savedEvents, (key, value) => {
          if (key === 'start' || key === 'end') {
            return new Date(value);
          }
          return value;
        });
        setEvents(parsedEvents);
      } catch (e) {
        console.error("Error parsing events from localStorage:", e);
        // Initialize with mock data if there's an error
        const mockEvents = generateMockEvents(selectedDate);
        setEvents(mockEvents);
      }
    } else {
      // Initialize with mock data if no saved events
      const mockEvents = generateMockEvents(selectedDate);
      setEvents(mockEvents);
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = (event: Omit<CalendarEvent, "id">) => {
    setEvents(prevEvents => createEvent(prevEvents, event));
  };

  const editEvent = (event: CalendarEvent) => {
    setEvents(prevEvents => updateEvent(prevEvents, event));
  };

  const removeEvent = (id: string) => {
    setEvents(prevEvents => deleteEvent(prevEvents, id));
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        selectedDate,
        setSelectedDate,
        addEvent,
        editEvent,
        removeEvent,
        view,
        setView,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
