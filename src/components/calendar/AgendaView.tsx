import React, { useState, useMemo } from 'react';
import { useCalendar } from '@/context/CalendarContext';
import { format, isSameDay, isToday, isTomorrow, isThisWeek, isThisMonth, compareAsc } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Calendar as CalendarIcon, 
  Filter, 
  Clock, 
  MapPin, 
  ChevronRight,
  Users,
  Home,
  Target,
  FileText
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface AgendaViewProps {
  onEditEvent: (event: any) => void;
}

// Helper function to get event icon
const getEventIcon = (type: string) => {
  switch (type) {
    case 'work': return <Users className="h-4 w-4" />;
    case 'personal': return <Home className="h-4 w-4" />;
    case 'focus': return <Target className="h-4 w-4" />;
    case 'other': return <FileText className="h-4 w-4" />;
    default: return <CalendarIcon className="h-4 w-4" />;
  }
};

const AgendaView: React.FC<AgendaViewProps> = ({ onEditEvent }) => {
  const { events, selectedDate, setSelectedDate } = useCalendar();
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);

  // Get unique event types from all events
  const eventTypes = useMemo(() => {
    const types = new Set(events.map(event => event.type));
    return Array.from(types);
  }, [events]);

  // Filter events based on time range, search, and type
  const filteredEvents = useMemo(() => {
    return events
      .filter(event => {
        // Apply time filter
        if (timeFilter === 'today') return isToday(new Date(event.start));
        if (timeFilter === 'week') return isThisWeek(new Date(event.start));
        if (timeFilter === 'month') return isThisMonth(new Date(event.start));
        return true; // 'all' or any other value
      })
      .filter(event => {
        // Apply search filter
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
          event.title.toLowerCase().includes(search) ||
          (event.description && event.description.toLowerCase().includes(search)) ||
          (event.location && event.location.toLowerCase().includes(search))
        );
      })
      .filter(event => {
        // Apply type filter
        if (selectedTypes.length === 0) return true;
        return selectedTypes.includes(event.type);
      })
      .sort((a, b) => compareAsc(new Date(a.start), new Date(b.start))); // Sort by start time
  }, [events, timeFilter, searchTerm, selectedTypes]);

  // Group events by date
  const groupedEvents = useMemo(() => {
    const grouped: { [key: string]: any[] } = {};
    
    filteredEvents.forEach(event => {
      const dateKey = format(new Date(event.start), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    
    return grouped;
  }, [filteredEvents]);

  // Get formatted date heading
  const getDateHeading = (dateStr: string) => {
    const date = new Date(dateStr);
    
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    
    return format(date, 'EEEE, MMMM d');
  };

  // Toggle event type filter
  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  // Get event time display
  const getEventTimeDisplay = (event: any) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    
    // Same day events show start and end time
    if (isSameDay(start, end)) {
      return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
    }
    
    // Multi-day events show dates and times
    return `${format(start, 'MMM d, h:mm a')} - ${format(end, 'MMM d, h:mm a')}`;
  };

  // Handle event click
  const handleEventClick = (event: any) => {
    setSelectedDate(new Date(event.start));
    onEditEvent(event);
  };

  // Color map for event types
  const typeColorMap: Record<string, string> = {
    work: 'bg-red-100 text-red-800 hover:bg-red-200',
    personal: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    focus: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    other: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
  };

  return (
    <div className="agenda-view h-[calc(100vh-15rem)] flex flex-col">
      {/* Search and filter toolbar */}
      <div className="p-4 border-b flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            className="pl-9 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          {/* Date picker */}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setShowCalendar(!showCalendar)}
            className={cn(showCalendar && "bg-gray-100")}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
          
          {/* Filter by type */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {eventTypes.map(type => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => toggleTypeFilter(type)}
                >
                  <div className="flex items-center">
                    {getEventIcon(type)}
                    <span className="ml-2 capitalize">{type}</span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Time range tabs */}
      <div className="p-2 border-b">
        <Tabs 
          defaultValue={timeFilter} 
          value={timeFilter} 
          onValueChange={(v) => setTimeFilter(v as any)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Date picker popup */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 border-b bg-white shadow-md"
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setTimeFilter('all');
                  setShowCalendar(false);
                }
              }}
              className="mx-auto"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Event list */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.keys(groupedEvents).length > 0 ? (
          Object.keys(groupedEvents)
            .sort()
            .map(dateKey => (
              <div key={dateKey} className="mb-6">
                <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-white py-1 z-10">
                  {getDateHeading(dateKey)}
                </h3>
                
                <div className="space-y-2">
                  {groupedEvents[dateKey].map(event => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.01 }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-all"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center">
                          <div className="mr-2">
                            {getEventIcon(event.type)}
                          </div>
                          <h4 className="font-medium">{event.title}</h4>
                        </div>
                        <Badge 
                          variant="secondary"
                          className={cn("text-xs", typeColorMap[event.type] || "bg-gray-100")}
                        >
                          {event.type}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 flex items-center mt-2">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        {getEventTimeDisplay(event)}
                      </div>
                      
                      {event.location && (
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1.5" />
                          {event.location}
                        </div>
                      )}
                      
                      {event.description && (
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p className="text-lg">No events found</p>
            <p className="text-sm">Try changing your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaView; 