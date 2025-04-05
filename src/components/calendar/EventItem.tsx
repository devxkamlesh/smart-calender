import React from 'react';
import type { CalendarEvent } from '@/services/calendarService';
import { format, differenceInMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import { MapPin, Clock, Calendar, User, Tag, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface EventItemProps {
  event: CalendarEvent;
  compact?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
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

// Get event duration in a human-readable format
const getEventDuration = (event: CalendarEvent) => {
  const minutes = differenceInMinutes(event.end, event.start);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

const EventItem: React.FC<EventItemProps> = ({ 
  event, 
  compact = false, 
  onClick,
  showDetails = true
}) => {
  const eventTypeStyles = {
    work: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-700',
      hover: 'hover:bg-red-100',
      badgeBg: 'bg-red-100',
      icon: <User className="h-3.5 w-3.5" />
    },
    personal: {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-700',
      hover: 'hover:bg-blue-100',
      badgeBg: 'bg-blue-100',
      icon: <Calendar className="h-3.5 w-3.5" />
    },
    focus: {
      bg: 'bg-amber-50',
      border: 'border-amber-400',
      text: 'text-amber-700',
      hover: 'hover:bg-amber-100',
      badgeBg: 'bg-amber-100',
      icon: <Tag className="h-3.5 w-3.5" />
    },
    other: {
      bg: 'bg-purple-50',
      border: 'border-purple-400',
      text: 'text-purple-700',
      hover: 'hover:bg-purple-100',
      badgeBg: 'bg-purple-100',
      icon: <Calendar className="h-3.5 w-3.5" />
    }
  };
  
  const styles = eventTypeStyles[event.type];
  
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div 
              onClick={onClick}
              className={cn(
                "rounded-sm p-2 mb-1 shadow-sm cursor-pointer transition-all",
                styles.bg, "border-l-2", styles.border, styles.hover
              )}
              whileHover={{ x: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium truncate text-sm flex items-center gap-1">
                  <span>{getEventEmoji(event.type)}</span>
                  <span>{event.title}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {format(event.start, 'h:mm')}
                </div>
              </div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent className="p-3 max-w-[300px] bg-white shadow-md">
            <div className="text-sm font-medium mb-1 flex items-center gap-1">
              <span>{getEventEmoji(event.type)}</span> {event.title}
            </div>
            <div className="text-xs bg-gray-50 py-1 px-2 rounded-sm mb-1 flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-500" />
              {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
              <span className="ml-1 text-gray-400">({getEventDuration(event)})</span>
            </div>
            {event.location && (
              <div className="text-xs flex items-center gap-1 text-gray-600">
                <MapPin className="h-3 w-3" />
                {event.location}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <motion.div 
      onClick={onClick}
      className={cn(
        "rounded-md p-3 shadow-sm cursor-pointer transition-all border",
        styles.bg, styles.border, styles.hover,
        "border-l-[3px]"
      )}
      whileHover={{ y: -2, boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span>{getEventEmoji(event.type)}</span>
          <h3 className="font-medium">{event.title}</h3>
        </div>
        <Badge 
          variant="outline" 
          className={cn(
            "text-xs", 
            styles.badgeBg, 
            styles.text,
            "border-0"
          )}
        >
          {event.type}
        </Badge>
      </div>
      
      <div className="space-y-1.5">
        <div className="text-sm flex items-center gap-1.5 text-gray-600">
          <Clock className="h-3.5 w-3.5" />
          <div className="flex items-center gap-1">
            <span>{format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}</span>
            <Badge variant="secondary" className="h-5 text-xs font-normal bg-gray-100 border-0">
              {getEventDuration(event)}
            </Badge>
          </div>
        </div>
        
        {event.location && (
          <div className="text-sm flex items-center gap-1.5 text-gray-600">
            <MapPin className="h-3.5 w-3.5" />
            {event.location}
          </div>
        )}
      </div>
      
      {showDetails && event.description && (
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="text-sm text-gray-600 line-clamp-2">
            {event.description}
          </div>
          {event.description.length > 120 && (
            <div className="flex justify-end mt-1">
              <div className="text-xs flex items-center text-gray-400 hover:text-gray-600 cursor-pointer gap-0.5">
                <span>Read more</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default EventItem;
