import React, { useState } from 'react';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import DayView from '@/components/calendar/DayView';
import WeekView from '@/components/calendar/WeekView';
import MonthView from '@/components/calendar/MonthView';
import AgendaView from '@/components/calendar/AgendaView';
import EventForm from '@/components/calendar/EventForm';
import { useCalendar } from '@/context/CalendarContext';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Calendar as CalendarIcon, 
  ChevronRight 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const Calendar: React.FC = () => {
  const { view, selectedDate } = useCalendar();
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsEventFormOpen(true);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  const handleCloseEventForm = () => {
    setIsEventFormOpen(false);
    setEditingEvent(null);
  };

  // Get view title
  const getViewTitle = () => {
    switch (view) {
      case 'day': 
        return format(selectedDate, 'EEEE, MMMM d, yyyy');
      case 'week': 
        return 'Week View';
      case 'month': 
        return format(selectedDate, 'MMMM yyyy');
      case 'agenda': 
        return 'Agenda View';
      default: 
        return 'Calendar';
    }
  };

  return (
    <div className="calendar-page flex flex-col h-screen bg-slate-50/50 p-4 md:p-6 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
            <CalendarIcon className="h-4 w-4" />
            <span>Calendar</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-700">{view.charAt(0).toUpperCase() + view.slice(1)} View</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {getViewTitle()}
          </h1>
        </div>
        
        <Button 
          onClick={handleAddEvent} 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm transition-all hover:shadow"
          size="sm"
        >
          <PlusCircle className="h-4 w-4 mr-1.5" /> 
          <span>New Event</span>
        </Button>
      </div>
      
      <Card className="mb-5 shadow-sm border border-slate-200/80 rounded-xl overflow-hidden">
        <CardContent className="p-3">
          <CalendarHeader onAddEvent={handleAddEvent} />
        </CardContent>
      </Card>
      
      <div className="flex-1 min-h-0 overflow-hidden">
        <Card className="shadow-sm border border-slate-200/80 rounded-xl h-full flex flex-col overflow-hidden">
          <div className={cn(
            "calendar-view-container flex-1 min-h-0 overflow-hidden",
            view === 'month' && "p-0",
            (view === 'day' || view === 'week' || view === 'agenda') && "p-3 md:p-4"
          )}>
            {view === 'day' && <DayView onEditEvent={handleEditEvent} />}
            {view === 'week' && <WeekView onEditEvent={handleEditEvent} />}
            {view === 'month' && <MonthView onEditEvent={handleEditEvent} />}
            {view === 'agenda' && <AgendaView onEditEvent={handleEditEvent} />}
          </div>

          <div className="hidden md:flex calendar-features border-t border-slate-200 bg-slate-50/80 py-3 px-4 text-xs text-slate-500">
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-full h-1.5 w-1.5 mr-1.5"></div>
              <span className="mr-4">Events: {Math.floor(Math.random() * 30) + 10}</span>
            </div>
            <Separator orientation="vertical" className="mx-3 h-4" />
            <div className="flex items-center">
              <div className="bg-slate-600 rounded-full h-1.5 w-1.5 mr-1.5"></div>
              <span className="mr-4">Last updated: {format(new Date(), 'h:mm a')}</span>
            </div>
          </div>
        </Card>
      </div>
      
      <EventForm 
        isOpen={isEventFormOpen} 
        onClose={handleCloseEventForm}
        editingEvent={editingEvent}
      />
    </div>
  );
};

export default Calendar;
