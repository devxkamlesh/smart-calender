import React, { useState, useRef, useEffect } from 'react';
import { 
  format, 
  addDays, 
  startOfWeek, 
  endOfWeek, 
  isSameDay, 
  isToday,
  getDay,
  addHours,
  addMinutes,
  isWithinInterval,
  isSameMonth,
  isBefore,
  isAfter,
  parseISO,
  getHours,
  getMinutes
} from 'date-fns';
import { useCalendar } from '@/context/CalendarContext';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/services/calendarService';
import { 
  MoreHorizontal,
  Clock,
  MapPin,
  ChevronsUpDown,
  Users,
  Home,
  Target,
  FileText
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WeekViewProps {
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
    case 'personal': return <Home className="h-3 w-3" />;
    case 'focus': return <Target className="h-3 w-3" />;
    case 'other': return <FileText className="h-3 w-3" />;
  }
};

const WeekView: React.FC<WeekViewProps> = ({ onEditEvent }) => {
  const { events, selectedDate, setSelectedDate } = useCalendar();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleHoursRange, setVisibleHoursRange] = useState({ start: 7, end: 20 });
  const [compactMode, setCompactMode] = useState(false);
  
  // Get days in the current week view
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Business hours (default 7am to 9pm)
  const totalHours = visibleHoursRange.end - visibleHoursRange.start + 1;
  const hours = Array.from(
    { length: totalHours }, 
    (_, i) => addHours(new Date(weekStart).setHours(visibleHoursRange.start, 0, 0, 0), i)
  );
  
  // Filter events for the current week
  const weekEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return isWithinInterval(eventDate, {
      start: weekStart,
      end: endOfWeek(selectedDate, { weekStartsOn: 0 })
    });
  });

  // Group events by day
  const eventsByDay = weekDays.map(day => {
    return {
      day,
      events: weekEvents.filter(event => isSameDay(new Date(event.start), day))
        .sort((a, b) => a.start.getTime() - b.start.getTime())
    };
  });

  // Expand hours range to show all events (if needed)
  useEffect(() => {
    // Find earliest and latest event hours
    let earliestHour = visibleHoursRange.start;
    let latestHour = visibleHoursRange.end;
    
    weekEvents.forEach(event => {
      const startHour = getHours(new Date(event.start));
      const endHour = getHours(new Date(event.end));
      
      if (startHour < earliestHour) earliestHour = Math.max(0, startHour);
      if (endHour > latestHour) latestHour = Math.min(23, endHour + 1);
    });
    
    // Update range if needed, keeping at least 7 hours visible
    if (earliestHour < visibleHoursRange.start || latestHour > visibleHoursRange.end) {
      setVisibleHoursRange({
        start: Math.min(earliestHour, visibleHoursRange.start),
        end: Math.max(latestHour, visibleHoursRange.end)
      });
    }
  }, [weekEvents]);

  // Position an event in the timeline
  const positionEvent = (event: CalendarEvent, day: Date) => {
    if (!isSameDay(event.start, day)) return null;
    
    const startTime = new Date(event.start);
    const endTime = new Date(event.end);
    
    // Calculate top position based on visible hours range
    const hourHeight = 100 / totalHours; // % per hour
    const startHour = getHours(startTime) + getMinutes(startTime) / 60;
    const endHour = getHours(endTime) + getMinutes(endTime) / 60;
    
    // Adjust for the visible range
    const adjustedStartHour = Math.max(0, startHour - visibleHoursRange.start);
    const adjustedEndHour = Math.min(totalHours, endHour - visibleHoursRange.start);
    
    const topPercentage = adjustedStartHour * hourHeight;
    const heightPercentage = Math.max(hourHeight / 4, (adjustedEndHour - adjustedStartHour) * hourHeight);
    
    return {
      top: `${topPercentage}%`,
      height: `${heightPercentage}%`,
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
    const currentHour = getHours(now);
    const currentMinute = getMinutes(now);
    
    // Only show if within visible hours
    if (currentHour < visibleHoursRange.start || currentHour > visibleHoursRange.end) return null;
    
    const hourHeight = 100 / totalHours; // % per hour
    const topPercentage = (currentHour - visibleHoursRange.start + currentMinute / 60) * hourHeight;
    
    return (
      <div 
        className="absolute left-[60px] right-0 flex items-center z-20 pointer-events-none"
        style={{ top: `${topPercentage}%` }}
      >
        <div className="flex-1 h-[2px] bg-red-500"></div>
        <div className="px-2 py-1 bg-red-500 text-white text-xs rounded-l">
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
    setVisibleHoursRange({ start: 7, end: 20 }); // Default business hours
  };

  return (
    <div className="week-view rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden h-[calc(100vh-15rem)] flex flex-col">
      {/* Week navigation and options */}
      <div className="bg-gray-50 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 px-3 gap-2">
        <div className="flex flex-wrap gap-1">
          {weekDays.map((day, i) => {
            const isSelectedDay = isSameDay(day, selectedDate);
            const _isToday = isToday(day);
            const inCurrentMonth = isSameMonth(day, selectedDate);
            
            return (
              <Button 
                key={i}
                variant={isSelectedDay ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-auto py-1 flex flex-col items-center gap-1",
                  isSelectedDay && "bg-calendar text-white",
                  !inCurrentMonth && !isSelectedDay && "text-gray-400",
                  _isToday && !isSelectedDay && "ring-1 ring-calendar/30"
                )}
                onClick={() => setSelectedDate(day)}
              >
                <span className="text-xs font-normal">{format(day, 'EEE')}</span>
                <span className={cn(
                  "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                  _isToday && !isSelectedDay && "bg-calendar/10"
                )}>
                  {format(day, 'd')}
                </span>
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 text-xs"
            onClick={() => setCompactMode(!compactMode)}
          >
            {compactMode ? 'Detailed View' : 'Compact View'}
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
      
      {/* Week timeline */}
      <div ref={containerRef} className="flex-1 overflow-y-auto relative">
        <div className="relative h-[1500px]">
          {/* Current time indicator */}
          {currentTimeIndicator()}
          
          {/* Time grid */}
          <div className="absolute top-0 left-0 right-0 bottom-0 grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
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
                  {!compactMode && (
                    <div className="absolute w-full text-right pr-2" style={{ top: '30px' }}>
                      <div className="text-xs text-gray-400 -mt-3">
                        {format(addMinutes(hour, 30), 'h:mm')}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Day columns */}
            {weekDays.map((day, dayIndex) => {
              const dayEvents = eventsByDay[dayIndex].events;
              const isCurrentDay = isToday(day);
              
              return (
                <div 
                  key={dayIndex} 
                  className={cn(
                    "relative border-r border-gray-100",
                    isCurrentDay && "bg-blue-50/30"
                  )}
                  onClick={() => setSelectedDate(day)}
                >
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
                      {!compactMode && (
                        <div 
                          className="absolute w-full border-t border-gray-100 border-dashed" 
                          style={{ top: '30px' }}
                        />
                      )}
                    </div>
                  ))}
                  
                  {/* Events for this day */}
                  <TooltipProvider>
                    {dayEvents.map(event => {
                      const position = positionEvent(event, day);
                      if (!position) return null;
                      
                      return (
                        <Tooltip key={event.id}>
                          <TooltipTrigger asChild>
                            <div 
                              className="absolute left-0 right-0 mx-1 overflow-hidden"
                              style={position}
                            >
                              <div 
                                className={cn(
                                  "rounded p-1.5 h-full overflow-hidden border-l-2 shadow-sm cursor-pointer transition-all hover:shadow",
                                  event.type === 'work' && "bg-red-50 border-red-400",
                                  event.type === 'personal' && "bg-blue-50 border-blue-400",
                                  event.type === 'focus' && "bg-amber-50 border-amber-400",
                                  event.type === 'other' && "bg-purple-50 border-purple-400"
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditEvent && onEditEvent(event);
                                }}
                              >
                                <div className="flex items-center justify-between mb-0.5">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs">{getEventEmoji(event.type)}</span>
                                    <span className="text-xs font-medium truncate">
                                      {compactMode ? event.title.slice(0, 20) : event.title}
                                    </span>
                                  </div>
                                  {!compactMode && (
                                    <Badge 
                                      variant="outline" 
                                      className={cn(
                                        "flex h-4 px-1 text-[10px]",
                                        event.type === 'work' && "bg-red-100 text-red-700 border-red-200",
                                        event.type === 'personal' && "bg-blue-100 text-blue-700 border-blue-200",
                                        event.type === 'focus' && "bg-amber-100 text-amber-700 border-amber-200",
                                        event.type === 'other' && "bg-purple-100 text-purple-700 border-purple-200"
                                      )}
                                    >
                                      {event.type}
                                    </Badge>
                                  )}
                                </div>

                                {!compactMode && (
                                  <>
                                    <div className="text-[10px] text-gray-500 flex items-center gap-0.5">
                                      <Clock className="h-2.5 w-2.5" />
                                      {format(event.start, 'h:mm')} - {format(event.end, 'h:mm a')}
                                    </div>
                                    
                                    {event.location && (
                                      <div className="text-[10px] text-gray-500 flex items-center gap-0.5 truncate">
                                        <MapPin className="h-2.5 w-2.5" />
                                        {event.location}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </TooltipTrigger>
                          
                          <TooltipContent 
                            className="bg-white p-3 shadow-lg border border-gray-200 max-w-[250px]"
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
                                {event.description.length > 120 
                                  ? `${event.description.substring(0, 120)}...` 
                                  : event.description
                                }
                              </div>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;
