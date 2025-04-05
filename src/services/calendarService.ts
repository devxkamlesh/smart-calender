
import { format, addDays, subDays, startOfWeek, endOfWeek } from "date-fns";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "work" | "personal" | "focus" | "other";
  location?: string;
  description?: string;
}

// Generate mock events for the current week
export const generateMockEvents = (baseDate: Date): CalendarEvent[] => {
  const startDate = startOfWeek(baseDate);
  const endDate = endOfWeek(baseDate);
  
  const mockEvents: CalendarEvent[] = [
    {
      id: "1",
      title: "Team Meeting",
      start: new Date(format(addDays(startDate, 1), 'yyyy-MM-dd') + 'T10:00:00'),
      end: new Date(format(addDays(startDate, 1), 'yyyy-MM-dd') + 'T11:00:00'),
      type: "work",
      location: "Conference Room A",
      description: "Weekly team sync meeting"
    },
    {
      id: "2",
      title: "Project Planning",
      start: new Date(format(addDays(startDate, 1), 'yyyy-MM-dd') + 'T14:00:00'),
      end: new Date(format(addDays(startDate, 1), 'yyyy-MM-dd') + 'T15:30:00'),
      type: "work",
      location: "Virtual",
      description: "Planning session for Q2 roadmap"
    },
    {
      id: "3",
      title: "Gym Session",
      start: new Date(format(addDays(startDate, 2), 'yyyy-MM-dd') + 'T18:00:00'),
      end: new Date(format(addDays(startDate, 2), 'yyyy-MM-dd') + 'T19:30:00'),
      type: "personal",
      location: "City Gym",
    },
    {
      id: "4",
      title: "Deep Work: Report",
      start: new Date(format(addDays(startDate, 3), 'yyyy-MM-dd') + 'T09:00:00'),
      end: new Date(format(addDays(startDate, 3), 'yyyy-MM-dd') + 'T12:00:00'),
      type: "focus",
      description: "Focus time for quarterly report"
    },
    {
      id: "5",
      title: "Lunch with Sarah",
      start: new Date(format(addDays(startDate, 3), 'yyyy-MM-dd') + 'T12:30:00'),
      end: new Date(format(addDays(startDate, 3), 'yyyy-MM-dd') + 'T13:30:00'),
      type: "personal",
      location: "Cafe Central",
    },
    {
      id: "6",
      title: "Client Call",
      start: new Date(format(addDays(startDate, 4), 'yyyy-MM-dd') + 'T15:00:00'),
      end: new Date(format(addDays(startDate, 4), 'yyyy-MM-dd') + 'T16:00:00'),
      type: "work",
      location: "Virtual",
      description: "Review progress with client"
    },
    {
      id: "7",
      title: "Deep Work: Code",
      start: new Date(format(addDays(startDate, 4), 'yyyy-MM-dd') + 'T09:00:00'),
      end: new Date(format(addDays(startDate, 4), 'yyyy-MM-dd') + 'T11:00:00'),
      type: "focus",
      description: "Focus time for feature implementation"
    },
    {
      id: "8",
      title: "Dentist Appointment",
      start: new Date(format(addDays(startDate, 5), 'yyyy-MM-dd') + 'T11:00:00'),
      end: new Date(format(addDays(startDate, 5), 'yyyy-MM-dd') + 'T12:00:00'),
      type: "personal",
      location: "Downtown Dental",
      description: "Regular checkup"
    }
  ];
  
  return mockEvents;
};

// Get events for a specific day
export const getEventsForDay = (events: CalendarEvent[], day: Date): CalendarEvent[] => {
  const dayStr = format(day, 'yyyy-MM-dd');
  return events.filter(event => {
    const eventDate = format(event.start, 'yyyy-MM-dd');
    return eventDate === dayStr;
  });
};

// Get events for a specific week
export const getEventsForWeek = (events: CalendarEvent[], day: Date): CalendarEvent[] => {
  const start = startOfWeek(day);
  const end = endOfWeek(day);
  
  return events.filter(event => {
    const eventDate = event.start;
    return eventDate >= start && eventDate <= end;
  });
};

// Create a new event
export const createEvent = (events: CalendarEvent[], newEvent: Omit<CalendarEvent, "id">): CalendarEvent[] => {
  const eventWithId = {
    ...newEvent,
    id: Math.random().toString(36).substring(2, 11)
  };
  
  return [...events, eventWithId];
};

// Update an existing event
export const updateEvent = (events: CalendarEvent[], updatedEvent: CalendarEvent): CalendarEvent[] => {
  return events.map(event => event.id === updatedEvent.id ? updatedEvent : event);
};

// Delete an event
export const deleteEvent = (events: CalendarEvent[], id: string): CalendarEvent[] => {
  return events.filter(event => event.id !== id);
};
