import React, { useState, useRef, useEffect } from 'react';
import { 
  format, 
  addHours, 
  startOfDay, 
  isSameDay, 
  addMinutes, 
  isBefore, 
  isAfter, 
  isToday,
  subDays,
  addDays,
  getHours,
  getMinutes,
  differenceInMinutes
} from 'date-fns';
import { useCalendar } from '@/context/CalendarContext';
import type { CalendarEvent } from '@/services/calendarService';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsUpDown,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Home,
  Target,
  FileText,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DayViewProps {
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
    case 'work': return <Users className="h-3.5 w-3.5" />;
    case 'personal': return <Home className="h-3.5 w-3.5" />;
    case 'focus': return <Target className="h-3.5 w-3.5" />;
    case 'other': return <FileText className="h-3.5 w-3.5" />;
  }
};

const DayView: React.FC<DayViewProps> = ({ onEditEvent }) => {
  const { events, selectedDate, setSelectedDate } = useCalendar();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleHoursRange, setVisibleHoursRange] = useState({ start: 7, end: 21 });
  const [detailsMode, setDetailsMode] = useState(true);

  // Calculate visible hours
  const totalHours = visibleHoursRange.end - visibleHoursRange.start + 1;
  const hours = Array.from(
    { length: totalHours }, 
    (_, i) => addHours(new Date(selectedDate).setHours(visibleHoursRange.start, 0, 0, 0), i)
  );
  
  // Filter events for the selected day
  const dayEvents = events.filter(event => isSameDay(event.start, selectedDate));

  // Order events by start time
  const sortedEvents = [...dayEvents].sort((a, b) => 
    a.start.getTime() - b.start.getTime()
  );

  // Navigation functions
  const goToPrevDay = () => setSelectedDate(subDays(selectedDate, 1));
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const goToToday = () => setSelectedDate(new Date());

  // Expand hours range based on events
  useEffect(() => {
    let earliestHour = visibleHoursRange.start;
    let latestHour = visibleHoursRange.end;
    
    sortedEvents.forEach(event => {
      const startHour = getHours(new Date(event.start));
      const endHour = getHours(new Date(event.end));
      
      if (startHour < earliestHour) earliestHour = Math.max(0, startHour);
      if (endHour > latestHour) latestHour = Math.min(23, endHour + 1);
    });
    
    if (earliestHour < visibleHoursRange.start || latestHour > visibleHoursRange.end) {
      setVisibleHoursRange({
        start: Math.min(earliestHour, visibleHoursRange.start),
        end: Math.max(latestHour, visibleHoursRange.end)
      });
    }
  }, [sortedEvents, selectedDate]);
  
  // Position an event in the timeline
  const positionEvent = (event: CalendarEvent) => {
    const startTime = new Date(event.start);
    
    // Calculate top position based on visible hours range
    const hourHeight = 100 / totalHours; // % per hour
    const startHour = getHours(startTime) + getMinutes(startTime) / 60;
    const endTime = new Date(event.end);
    const endHour = getHours(endTime) + getMinutes(endTime) / 60;
    
    // Adjust for the visible range
    const adjustedStartHour = Math.max(0, startHour - visibleHoursRange.start);
    const adjustedEndHour = Math.min(totalHours, endHour - visibleHoursRange.start);
    
    const topPercentage = adjustedStartHour * hourHeight;
    const heightPercentage = Math.max(hourHeight / 4, (adjustedEndHour - adjustedStartHour) * hourHeight);
    
    return {
      top: `${topPercentage}%`,
      height: `${heightPercentage}%`,
      width: '95%',
    };
  };

  // Scroll to current time on initial render
  useEffect(() => {
    if (containerRef.current) {
      const now = new Date();
      const currentHour = getHours(now);
      const currentMinute = getMinutes(now);
      
      // Only scroll during business hours
      if (currentHour >= visibleHoursRange.start && currentHour <= visibleHoursRange.end) {
        const hourHeight = 100 / totalHours; // % per hour
        const timePercentage = (currentHour - visibleHoursRange.start + currentMinute / 60) * hourHeight;
        
        const scrollPosition = (timePercentage / 100) * containerRef.current.scrollHeight;
        containerRef.current.scrollTop = scrollPosition - 100;
      }
    }
  }, [selectedDate, visibleHoursRange, totalHours]);

  // Current time indicator
  const currentTimeIndicator = () => {
    const now = new Date();
    
    // Only show for today
    if (!isSameDay(now, selectedDate)) return null;
    
    const currentHour = getHours(now);
    const currentMinute = getMinutes(now);
    
    // Only show if within visible hours
    if (currentHour < visibleHoursRange.start || currentHour > visibleHoursRange.end) return null;
    
    const hourHeight = 100 / totalHours; // % per hour
    const topPercentage = (currentHour - visibleHoursRange.start + currentMinute / 60) * hourHeight;
    
    return (
      <div 
        className="absolute left-[80px] right-4 flex items-center z-20 pointer-events-none"
        style={{ top: `${topPercentage}%` }}
      >
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="flex-1 h-[2px] bg-red-500"></div>
        <div className="px-2 py-1 bg-red-500 text-white text-xs rounded">
          {format(now, 'h:mm a')}
        </div>
      </div>
    );
  };

  // Handle hour range adjustment
  const expandHourRange = () => {
    setVisibleHoursRange(prev => ({
      start: Math.max(0, prev.start - 2),
      end: Math.min(23, prev.end + 2)
    }));
  };

  const resetHourRange = () => {
    setVisibleHoursRange({ start: 7, end: 21 }); // Default business hours
  };

  // Get the duration of an event in a human-readable format
  const getEventDuration = (event: CalendarEvent) => {
    const minutes = differenceInMinutes(event.end, event.start);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="day-view rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden h-[calc(100vh-15rem)] flex flex-col">
      {/* Day header with navigation */}
      <div className="bg-gray-50 border-b flex flex-col sm:flex-row items-center justify-between p-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={goToPrevDay} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-medium px-2">{format(selectedDate, 'EEEE, MMMM d')}</h2>
            <Button variant="ghost" size="icon" onClick={goToNextDay} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {!isToday(selectedDate) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToToday} 
              className="text-xs h-8 gap-1"
            >
              <CalendarIcon className="h-3.5 w-3.5" /> Today
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-gray-100">
            {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''}
          </Badge>
          
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 text-xs"
            onClick={() => setDetailsMode(!detailsMode)}
          >
            {detailsMode ? 'Simple View' : 'Detailed View'}
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ChevronsUpDown className="h-3.5 w-3.5" />
                <span className="text-xs">Hours</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52">
              <div className="space-y-2">
                <div className="text-sm font-medium">Time Range</div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">
                    {format(new Date().setHours(visibleHoursRange.start, 0, 0, 0), 'h a')} - {format(new Date().setHours(visibleHoursRange.end, 0, 0, 0), 'h a')}
                  </span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={expandHourRange}>
                      Expand
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={resetHourRange}>
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex flex-1 divide-x">
        {/* Timeline view */}
        <div ref={containerRef} className="flex-1 overflow-y-auto relative">
          <div className="relative h-[1500px]">
            {/* Current time indicator */}
            {currentTimeIndicator()}
            
            {/* Time grid */}
            <div className="absolute top-0 left-0 right-0 bottom-0 grid grid-cols-[80px_1fr]">
              {/* Time labels column */}
              <div className="border-r border-gray-200 bg-gray-50">
                {hours.map((hour, i) => (
                  <div 
                    key={i} 
                    className="absolute w-full flex justify-end pr-2" 
                    style={{ top: `${(i / hours.length) * 100}%` }}
                  >
                    <div className="text-xs text-gray-500 -mt-3 font-medium">
                      {format(hour, 'h a')}
                    </div>
                    
                    {/* Half-hour marker */}
                    <div className="absolute w-full text-right pr-2" style={{ top: '30px' }}>
                      <div className="text-xs text-gray-400 -mt-3">
                        {format(addMinutes(hour, 30), 'h:mm')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Events column */}
              <div className="relative">
                {/* Hour markers */}
                {hours.map((hour, hourIndex) => (
                  <div 
                    key={hourIndex} 
                    className={cn(
                      "absolute w-full border-t", 
                      hourIndex === 0 ? "border-gray-300" : "border-gray-200"
                    )}
                    style={{ top: `${(hourIndex / hours.length) * 100}%` }}
                  >
                    {/* Half-hour marker */}
                    <div 
                      className="absolute w-full border-t border-gray-100 border-dashed" 
                      style={{ top: '30px' }}
                    />
                  </div>
                ))}
                
                {/* Events */}
                <TooltipProvider>
                  {sortedEvents.map(event => {
                    const position = positionEvent(event);
                    
                    return (
                      <Tooltip key={event.id}>
                        <TooltipTrigger asChild>
                          <div 
                            className="absolute left-0 right-4 mx-1 overflow-hidden"
                            style={position}
                          >
                            <div 
                              className={cn(
                                "rounded-md p-2 h-full overflow-hidden border-l-4 shadow-sm cursor-pointer transition-all hover:shadow",
                                event.type === 'work' && "bg-red-50 border-red-400",
                                event.type === 'personal' && "bg-blue-50 border-blue-400",
                                event.type === 'focus' && "bg-amber-50 border-amber-400",
                                event.type === 'other' && "bg-purple-50 border-purple-400"
                              )}
                              onClick={() => onEditEvent && onEditEvent(event)}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5">
                                  <span>{getEventEmoji(event.type)}</span>
                                  <span className="font-medium text-sm">{event.title}</span>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "flex h-5 text-xs",
                                    event.type === 'work' && "bg-red-100 text-red-700 border-red-200",
                                    event.type === 'personal' && "bg-blue-100 text-blue-700 border-blue-200",
                                    event.type === 'focus' && "bg-amber-100 text-amber-700 border-amber-200",
                                    event.type === 'other' && "bg-purple-100 text-purple-700 border-purple-200"
                                  )}
                                >
                                  {getEventDuration(event)}
                                </Badge>
                              </div>

                              {detailsMode && (
                                <>
                                  <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                    <Clock className="h-3 w-3" />
                                    {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                                  </div>
                                  
                                  {event.location && (
                                    <div className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                      <MapPin className="h-3 w-3" />
                                      {event.location}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </TooltipTrigger>
                        
                        <TooltipContent 
                          className="bg-white p-3 shadow-lg border border-gray-200 max-w-[300px]"
                          side="right"
                        >
                          <div className="text-sm font-medium mb-1 flex items-center gap-1">
                            <span>{getEventEmoji(event.type)}</span> {event.title}
                          </div>
                          <div className="bg-gray-50 p-1.5 rounded text-xs flex items-center gap-1 mb-1.5">
                            <Clock className="h-3 w-3 text-gray-500" />
                            {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                          </div>
                          {event.location && (
                            <div className="text-xs flex items-center gap-1 text-gray-600 mb-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          )}
                          {event.description && (
                            <div className="text-xs text-gray-600 mt-1.5 border-t border-gray-100 pt-1.5">
                              {event.description}
                            </div>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right sidebar with agenda view */}
        <div className="w-[300px] hidden lg:block overflow-y-auto">
          <div className="p-3 sticky top-0 bg-white z-10 border-b">
            <h3 className="font-medium text-sm flex items-center gap-1">
              <CalendarIcon className="h-4 w-4 text-gray-400" /> 
              Agenda for {format(selectedDate, 'MMM d')}
            </h3>
          </div>
          
          <div className="divide-y">
            {sortedEvents.length === 0 ? (
              <div className="p-6 text-center text-gray-500 flex flex-col items-center">
                <Info className="h-8 w-8 mb-2 text-gray-300" />
                <p className="text-sm">No events scheduled</p>
                <p className="text-xs mt-1">Your day is free!</p>
              </div>
            ) : (
              sortedEvents.map(event => (
                <div 
                  key={event.id} 
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onEditEvent && onEditEvent(event)}
                >
                  <div className="flex gap-2 items-start">
                    <div 
                      className={cn(
                        "mt-0.5 rounded-full p-1.5",
                        event.type === 'work' && "bg-red-100",
                        event.type === 'personal' && "bg-blue-100",
                        event.type === 'focus' && "bg-amber-100",
                        event.type === 'other' && "bg-purple-100"
                      )}
                    >
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">{event.title}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3" />
                        {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                      </div>
                      {event.location && (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
