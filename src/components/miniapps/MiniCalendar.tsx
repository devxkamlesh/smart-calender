import React, { useState } from 'react';
import { useCalendar } from '@/context/CalendarContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DayContentProps } from 'react-day-picker';

interface MiniCalendarProps {
  onDateSelect?: (date: Date) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ onDateSelect }) => {
  const { events, selectedDate, setSelectedDate, setView } = useCalendar();
  const [viewDate, setViewDate] = useState<Date>(selectedDate);

  // Handle month navigation
  const goToPreviousMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Open month view on title click
  const handleTitleClick = () => {
    setView('month');
  };

  // Get events for specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start), date) || 
      isSameDay(new Date(event.end), date) ||
      (isWithinInterval(date, {
        start: new Date(event.start),
        end: new Date(event.end)
      }))
    );
  };

  // Custom day rendering
  const renderDay = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    const hasEvents = dayEvents.length > 0;
    const isSelected = isSameDay(date, selectedDate);
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span 
          className={cn(
            "h-7 w-7 rounded-full flex items-center justify-center text-sm",
            isSelected && "bg-calendar text-white font-medium"
          )}
        >
          {format(date, 'd')}
        </span>
        
        {/* Event dot indicators */}
        {hasEvents && !isSelected && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
            {dayEvents.length > 2 ? (
              <>
                <span className="h-1 w-1 rounded-full bg-calendar opacity-80"></span>
                <span className="h-1 w-1 rounded-full bg-calendar opacity-80"></span>
                <span className="h-1 w-1 rounded-full bg-calendar opacity-80"></span>
              </>
            ) : (
              dayEvents.map((_, idx) => (
                <span key={idx} className="h-1 w-1 rounded-full bg-calendar opacity-80"></span>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle 
            className="text-base font-semibold flex items-center cursor-pointer hover:text-calendar"
            onClick={handleTitleClick}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>{format(viewDate, 'MMMM yyyy')}</span>
          </CardTitle>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goToPreviousMonth}
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goToNextMonth}
              className="h-7 w-7"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && handleDateSelect(date)}
          className="border-none p-0"
          month={viewDate}
          onMonthChange={setViewDate}
          components={{
            Day: (props: DayContentProps) => (
              <div className="text-center p-0 relative" {...props}>
                {props.date && renderDay(props.date)}
              </div>
            ),
          }}
        />
      </CardContent>
      
      <CardFooter className="pt-0 flex flex-col">
        <div className="w-full flex flex-wrap gap-1 mb-2">
          {getEventsForDate(selectedDate).slice(0, 2).map((event, idx) => (
            <div 
              key={idx}
              className="text-xs px-2 py-1 rounded bg-gray-100 truncate w-full"
            >
              {format(new Date(event.start), 'h:mm a')} - {event.title}
            </div>
          ))}
          
          {getEventsForDate(selectedDate).length > 2 && (
            <div className="text-xs text-gray-500 pl-2">
              +{getEventsForDate(selectedDate).length - 2} more events
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs justify-center text-gray-600 hover:text-gray-900"
          onClick={() => setView('day')}
        >
          View day
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MiniCalendar; 