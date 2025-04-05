import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCalendar } from '@/context/CalendarContext';
import { format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  Sliders,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';

interface CalendarHeaderProps {
  onAddEvent: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onAddEvent }) => {
  const { selectedDate, setSelectedDate, view, setView } = useCalendar();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const navigatePrevious = () => {
    switch (view) {
      case 'day':
        setSelectedDate(subDays(selectedDate, 1));
        break;
      case 'week':
        setSelectedDate(subWeeks(selectedDate, 1));
        break;
      case 'month':
        setSelectedDate(subMonths(selectedDate, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (view) {
      case 'day':
        setSelectedDate(addDays(selectedDate, 1));
        break;
      case 'week':
        setSelectedDate(addWeeks(selectedDate, 1));
        break;
      case 'month':
        setSelectedDate(addMonths(selectedDate, 1));
        break;
    }
  };

  const navigateToday = () => {
    setSelectedDate(new Date());
  };

  const getHeaderTitle = () => {
    switch (view) {
      case 'day':
        return format(selectedDate, 'EEEE, MMMM d, yyyy');
      case 'week':
        return `Week of ${format(selectedDate, 'MMMM d, yyyy')}`;
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      default:
        return '';
    }
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  const getViewTitle = () => {
    switch (view) {
      case 'day':
        return format(selectedDate, 'EEEE, MMMM d, yyyy');
      case 'week':
        return `Week of ${format(selectedDate, 'MMMM d, yyyy')}`;
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      case 'agenda':
        return 'Agenda';
      default:
        return '';
    }
  };

  const getFormattedDateRange = () => {
    switch (view) {
      case 'day':
        return format(selectedDate, 'MMM d');
      case 'week':
        return `${format(selectedDate, 'MMM d')} - ${format(selectedDate, 'MMM d, yyyy')}`;
      case 'month':
        return format(selectedDate, 'MMM yyyy');
      default:
        return '';
    }
  };

  const openDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 transition-all duration-200">
      <div className="flex flex-col space-y-4">
        {/* Top row with title and actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-calendar hidden sm:block" />
            <h1 className="text-2xl font-bold text-gray-800">{getHeaderTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
            {searchOpen ? (
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[200px] pr-8"
                  autoFocus
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full" 
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" /> 
                <span className="hidden sm:inline">Search</span>
              </Button>
            )}
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 relative">
                  <Filter className="h-4 w-4" /> 
                  <span className="hidden sm:inline">Filter</span>
                  {activeFilters.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-calendar">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Event Type</h4>
                  <div className="flex flex-wrap gap-1">
                    <Badge 
                      variant={activeFilters.includes('work') ? 'default' : 'outline'} 
                      className={cn(
                        "cursor-pointer",
                        activeFilters.includes('work') ? "bg-red-500" : "hover:bg-red-100"
                      )}
                      onClick={() => toggleFilter('work')}
                    >
                      Work
                    </Badge>
                    <Badge 
                      variant={activeFilters.includes('personal') ? 'default' : 'outline'} 
                      className={cn(
                        "cursor-pointer",
                        activeFilters.includes('personal') ? "bg-blue-500" : "hover:bg-blue-100"
                      )}
                      onClick={() => toggleFilter('personal')}
                    >
                      Personal
                    </Badge>
                    <Badge 
                      variant={activeFilters.includes('focus') ? 'default' : 'outline'} 
                      className={cn(
                        "cursor-pointer",
                        activeFilters.includes('focus') ? "bg-amber-500" : "hover:bg-amber-100"
                      )}
                      onClick={() => toggleFilter('focus')}
                    >
                      Focus
                    </Badge>
                    <Badge 
                      variant={activeFilters.includes('other') ? 'default' : 'outline'} 
                      className={cn(
                        "cursor-pointer",
                        activeFilters.includes('other') ? "bg-purple-500" : "hover:bg-purple-100"
                      )}
                      onClick={() => toggleFilter('other')}
                    >
                      Other
                    </Badge>
                  </div>
                </div>
                
                {activeFilters.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-3 text-xs"
                    onClick={() => setActiveFilters([])}
                  >
                    Clear Filters
                  </Button>
                )}
              </PopoverContent>
            </Popover>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Sliders className="h-4 w-4" /> 
                  <span className="hidden sm:inline">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Display Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={view} onValueChange={(v: any) => setView(v)}>
                  <DropdownMenuRadioItem value="day">Day View</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="week">Week View</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="month">Month View</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="agenda">Agenda View</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={navigateToday}>
                  Go to Today
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-calendar hover:bg-calendar-focus shadow-sm gap-1">
                  <Plus className="h-4 w-4" /> 
                  <span>Event</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onAddEvent} className="cursor-pointer">
                  Quick Event
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onAddEvent} className="cursor-pointer">
                  Detailed Event
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onAddEvent} className="cursor-pointer">
                  Recurring Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Bottom row with view controls and navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="bg-gray-100 rounded-md flex shadow-sm">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setView('day')}
              className={`rounded-l-md ${view === 'day' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''}`}
          >
            Day
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setView('week')}
              className={`${view === 'week' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''}`}
          >
            Week
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setView('month')}
              className={`${view === 'month' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''}`}
          >
            Month
          </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setView('agenda')}
              className={`rounded-r-md ${view === 'agenda' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''}`}
            >
              Agenda
            </Button>
        </div>
        
        <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={navigatePrevious} className="hover:bg-gray-100 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </Button>
            <Button variant="outline" size="sm" onClick={navigateToday} className="hover:bg-gray-100 transition-colors font-medium">
            Today
          </Button>
            <Button variant="outline" size="icon" onClick={navigateNext} className="hover:bg-gray-100 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </Button>
          </div>
        </div>
      </div>
      
      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mt-4 pt-2 border-t">
          <span className="text-xs text-gray-500">Active filters:</span>
          <div className="flex flex-wrap gap-1">
            {activeFilters.map(filter => (
              <Badge key={filter} variant="secondary" className="text-xs">
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => toggleFilter(filter)} 
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Date Picker Popup */}
      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <PopoverTrigger asChild>
          <span style={{ display: 'none' }}></span>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date);
                setIsDatePickerOpen(false);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CalendarHeader;
