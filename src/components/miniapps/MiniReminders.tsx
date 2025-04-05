import React from 'react';
import { useCalendar } from '@/context/CalendarContext';
import { format, isToday, isTomorrow, isWithinInterval, addDays, addHours } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, Calendar, Check, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MiniRemindersProps {
  maxItems?: number;
  onViewAll?: () => void;
  onEventClick?: (event: any) => void;
}

const MiniReminders: React.FC<MiniRemindersProps> = ({
  maxItems = 3,
  onViewAll,
  onEventClick
}) => {
  const { events, setSelectedDate, setView } = useCalendar();
  
  // Get upcoming events within the next 3 days
  const upcomingEvents = React.useMemo(() => {
    const now = new Date();
    const futureLimit = addDays(now, 3);
    
    return events
      .filter(event => {
        const eventStart = new Date(event.start);
        return isWithinInterval(eventStart, { start: now, end: futureLimit });
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, maxItems);
  }, [events, maxItems]);
  
  // Function to format the time relative to now
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 0) return "Now";
    if (diffMinutes < 60) return `In ${diffMinutes}m`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `In ${diffHours}h`;
    
    if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`;
    if (isTomorrow(date)) return `Tomorrow at ${format(date, 'h:mm a')}`;
    
    return format(date, 'EEE, MMM d');
  };
  
  // Get event type color
  const getEventColor = (type: string) => {
    switch (type) {
      case 'work': return 'bg-red-100 text-red-800 border-red-200';
      case 'personal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'focus': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'other': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Handle clicking "View All" button
  const handleViewAll = () => {
    setView('agenda');
    if (onViewAll) onViewAll();
  };
  
  // Handle clicking on an event
  const handleEventClick = (event: any) => {
    setSelectedDate(new Date(event.start));
    if (onEventClick) onEventClick(event);
  };
  
  // Calculate urgency level for visual indicators
  const getUrgencyLevel = (start: Date): number => {
    const now = new Date();
    const hoursUntil = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntil < 1) return 3; // Immediate (high urgency)
    if (hoursUntil < 3) return 2; // Soon (medium urgency)
    return 1; // Later (low urgency)
  };
  
  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center">
          <Bell className="h-4 w-4 mr-2" />
          Upcoming Reminders
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {upcomingEvents.length > 0 ? (
          <div className="space-y-2">
            {upcomingEvents.map((event, index) => {
              const startDate = new Date(event.start);
              const urgencyLevel = getUrgencyLevel(startDate);
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "p-2 border rounded-md cursor-pointer hover:shadow-sm transition-all",
                    getEventColor(event.type)
                  )}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm line-clamp-1">{event.title}</h4>
                    {urgencyLevel > 1 && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs px-1.5 py-0 h-5",
                          urgencyLevel === 3 ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                        )}
                      >
                        {urgencyLevel === 3 ? "Soon" : "Today"}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center text-xs opacity-80">
                    <Clock className="h-3 w-3 mr-1" />
                    {getRelativeTime(startDate)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No upcoming reminders</p>
          </div>
        )}
      </CardContent>
      
      {upcomingEvents.length > 0 && (
        <CardFooter className="pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between text-xs font-medium text-gray-600 hover:text-gray-900"
            onClick={handleViewAll}
          >
            View all reminders
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MiniReminders; 