import React, { useState } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay,
  addDays,
  format,
  isToday,
  getDay,
  addMonths,
  subMonths,
  setMonth,
  setYear,
  getYear,
  getMonth
} from 'date-fns';
import { useCalendar } from '@/context/CalendarContext';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import type { CalendarEvent } from '@/services/calendarService';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  CalendarCheck, 
  CheckCircle, 
  Users,
  MoreHorizontal,
  Clock,
  MapPin,
  CalendarIcon,
  Calendar as CalendarLogo,
  ArrowLeft,
  ArrowRight,
  CircleDot
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface MonthViewProps {
  onEditEvent?: (event: CalendarEvent) => void;
}

// Get event emoji based on type
const getEventEmoji = (type: string) => {
  switch (type) {
    case 'work': return '💼';
    case 'personal': return '🏠';
    case 'focus': return '🎯';
    case 'other': return '📝';
    default: return '📅';
  }
};

// Get event icon based on type
const getEventIcon = (type: string) => {
  switch (type) {
    case 'work': return <Users className="h-3 w-3" />;
    case 'personal': return <CalendarDays className="h-3 w-3" />;
    case 'focus': return <CheckCircle className="h-3 w-3" />;
    case 'other': return <CalendarCheck className="h-3 w-3" />;
    default: return <CalendarDays className="h-3 w-3" />;
  }
};

// Get event color based on type
const getEventColor = (type: string) => {
  switch (type) {
    case 'work': return {
      bg: 'bg-rose-50',
      border: 'border-rose-300',
      text: 'text-rose-700',
      hover: 'hover:bg-rose-100',
      dot: 'bg-rose-500',
      soft: 'bg-rose-100',
      light: 'bg-rose-50/50'
    };
    case 'personal': return {
      bg: 'bg-indigo-50',
      border: 'border-indigo-300',
      text: 'text-indigo-700',
      hover: 'hover:bg-indigo-100',
      dot: 'bg-indigo-500',
      soft: 'bg-indigo-100',
      light: 'bg-indigo-50/50'
    };
    case 'focus': return {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-700',
      hover: 'hover:bg-amber-100',
      dot: 'bg-amber-500',
      soft: 'bg-amber-100',
      light: 'bg-amber-50/50'
    };
    case 'other': return {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-700',
      hover: 'hover:bg-emerald-100',
      dot: 'bg-emerald-500',
      soft: 'bg-emerald-100',
      light: 'bg-emerald-50/50'
    };
    default: return {
      bg: 'bg-slate-50',
      border: 'border-slate-300',
      text: 'text-slate-700',
      hover: 'hover:bg-slate-100',
      dot: 'bg-slate-500',
      soft: 'bg-slate-100',
      light: 'bg-slate-50/50'
    };
  }
};

const MonthView: React.FC<MonthViewProps> = ({ onEditEvent }) => {
  const { events, selectedDate, setSelectedDate } = useCalendar();
  const [viewDate, setViewDate] = useState(selectedDate);

  // Generate month and year options
  const years = Array.from({ length: 10 }, (_, i) => getYear(new Date()) - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);

  // Navigation handlers
  const goToPreviousMonth = () => {
    const newDate = subMonths(viewDate, 1);
    setViewDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = addMonths(viewDate, 1);
    setViewDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setViewDate(today);
    setSelectedDate(today);
  };

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(viewDate, parseInt(month));
    setViewDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(viewDate, parseInt(year));
    setViewDate(newDate);
  };

  // Custom day renderer to show events
  const renderDay = (day: Date) => {
    const dayEvents = events.filter(event => 
      isSameDay(event.start, day)
    );

    // Group events by type
    const eventsByType = dayEvents.reduce((acc, event) => {
      acc[event.type] = acc[event.type] || [];
      acc[event.type].push(event);
      return acc;
    }, {} as Record<string, CalendarEvent[]>);

    const isSelected = isSameDay(day, selectedDate);
    const _isToday = isToday(day);
    const isCurrentMonth = isSameMonth(day, viewDate);
    
    // Get day of week (0-6, 0 is Sunday)
    const dayOfWeek = getDay(day);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    return (
      <div 
        onClick={() => setSelectedDate(day)}
        className={cn(
          "h-full rounded-xl border relative transition-all duration-200 backdrop-blur-sm",
          isCurrentMonth 
            ? "bg-white border-slate-200" 
            : "bg-slate-50/30 border-slate-100 opacity-60",
          isSelected && "ring-2 ring-indigo-400/30 border-indigo-300",
          isWeekend && isCurrentMonth && !isSelected && "bg-slate-50/60",
          "hover:shadow-sm hover:border-indigo-200 cursor-pointer"
        )}
      >
        {/* Date display */}
        <div className={cn(
          "py-1.5 px-2 flex justify-between items-center border-b",
          isCurrentMonth ? "border-slate-100" : "border-slate-100/50",
          _isToday && "bg-indigo-50/50"
        )}>
          <span className={cn(
            "text-xs font-medium",
            _isToday ? "text-indigo-600" : "text-slate-600"
          )}>
            {format(day, 'd')}
          </span>
          
          {_isToday && (
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              Today
            </span>
          )}
          
          {/* Event count bubble */}
          {dayEvents.length > 0 && !_isToday && (
            <span className="flex space-x-0.5">
              {Object.entries(eventsByType).map(([type, events]) => (
                <span 
                  key={type}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    getEventColor(type).dot
                  )}
                ></span>
              ))}
            </span>
          )}
        </div>
        
        {/* Events list */}
        <div className="p-1 space-y-1 overflow-hidden max-h-[70px]">
          <TooltipProvider>
            {dayEvents.slice(0, 2).map(event => (
              <Tooltip key={event.id}>
                <TooltipTrigger asChild>
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditEvent && onEditEvent(event);
                    }}
                    className={cn(
                      "text-[9px] px-1.5 py-1 rounded-md flex items-center gap-1",
                      "transition-all hover:translate-x-0.5",
                      getEventColor(event.type).soft,
                      getEventColor(event.type).text
                    )}
                  >
                    <div 
                      className={cn(
                        "h-1.5 w-1.5 rounded-full flex-shrink-0", 
                        getEventColor(event.type).dot
                      )}
                    ></div>
                    <span className="font-medium truncate">
                      {format(event.start, 'h:mm')} {event.title}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" align="start" className="p-3 max-w-[260px] border-slate-200 rounded-xl shadow-lg">
                  <div className="text-sm font-medium flex items-center mb-1.5">
                    <div className={cn(
                      "h-2 w-2 rounded-full mr-1.5",
                      getEventColor(event.type).dot
                    )}></div>
                    <span>{event.title}</span>
                  </div>
                  
                  <div className="flex items-center text-xs text-slate-600 mb-1">
                    <Clock className="h-3 w-3 mr-1.5 text-slate-400" />
                    <span>
                      {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                    </span>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center text-xs text-slate-600">
                      <MapPin className="h-3 w-3 mr-1.5 text-slate-400" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  
                  <div className="mt-2 flex items-center">
                    <Badge className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                      getEventColor(event.type).bg,
                      getEventColor(event.type).text,
                      "border-0"
                    )}>
                      {getEventEmoji(event.type)} {event.type}
                    </Badge>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
          
          {dayEvents.length > 2 && (
            <div 
              className="text-[9px] px-1.5 py-0.5 rounded-md text-slate-500 bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDate(day);
              }}
            >
              <MoreHorizontal className="h-2 w-2 mr-0.5" />
              <span>+{dayEvents.length - 2} more</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="month-view mx-auto w-[600px] h-auto flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header with calendar title and navigation */}
      <div className="py-3 px-4 border-b border-slate-200 bg-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CalendarLogo className="h-4 w-4 text-indigo-500" />
            <h2 className="text-sm font-semibold text-slate-700">
              {format(viewDate, 'MMMM yyyy')}
            </h2>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goToPreviousMonth}
              className="h-6 w-6 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            
            <Button 
              onClick={goToToday} 
              variant="ghost" 
              size="sm"
              className={cn(
                "h-6 text-[10px] px-2 rounded-full transition-colors",
                isToday(viewDate) 
                  ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" 
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              Today
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goToNextMonth}
              className="h-6 w-6 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        {/* Month/Year selector row */}
        <div className="flex items-center gap-2 mt-3">
          <Select value={getMonth(viewDate).toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="h-7 text-xs border-slate-200 rounded-lg w-[120px] bg-slate-50">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month.toString()}>
                  {format(new Date(2000, month, 1), 'MMMM')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={getYear(viewDate).toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="h-7 text-xs border-slate-200 rounded-lg w-[80px] bg-slate-50">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Weekday header */}
      <div className="grid grid-cols-7 py-2 border-b border-slate-200 bg-slate-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
          <div 
            key={day} 
            className={cn(
              "text-[10px] uppercase tracking-wider font-semibold text-center", 
              (i === 0 || i === 6) 
                ? "text-indigo-400" 
                : "text-slate-500"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days grid */}
      <div className="flex-1 p-2 bg-slate-100/50">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="border-0 shadow-none bg-transparent"
          month={viewDate}
          onMonthChange={setViewDate}
          components={{
            Day: ({ date, ...props }) => (
              <div className="p-0.5 aspect-square" {...props}>
                {renderDay(date)}
              </div>
            ),
          }}
        />
      </div>
      
      {/* Event type legend */}
      <div className="px-4 py-2 bg-white border-t border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-medium">Event Types:</span>
          <div className="flex gap-2">
            <div className="flex items-center text-[10px] font-medium">
              <span className="h-2 w-2 rounded-full bg-rose-500 mr-1"></span>
              <span className="text-slate-600">Work</span>
            </div>
            <div className="flex items-center text-[10px] font-medium">
              <span className="h-2 w-2 rounded-full bg-indigo-500 mr-1"></span>
              <span className="text-slate-600">Personal</span>
            </div>
            <div className="flex items-center text-[10px] font-medium">
              <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
              <span className="text-slate-600">Focus</span>
            </div>
            <div className="flex items-center text-[10px] font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1"></span>
              <span className="text-slate-600">Other</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthView;
