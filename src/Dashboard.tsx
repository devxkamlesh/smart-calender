import React from 'react';
import MiniCalendar from '@/components/miniapps/MiniCalendar';
import MiniReminders from '@/components/miniapps/MiniReminders';
import { useCalendar } from '@/context/CalendarContext';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, LayoutGrid, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { events, setSelectedDate, setView } = useCalendar();
  
  // Open event form with today's date
  const handleAddEvent = () => {
    setSelectedDate(new Date());
    // Navigate to calendar page
    setView('day');
  };
  
  // Navigate to specific calendar view
  const navigateToView = (view: 'day' | 'week' | 'month' | 'agenda') => {
    setView(view);
    // Redirect to calendar page if needed
    window.location.href = '/calendar';
  };
  
  // Handle event click from mini components
  const handleEventClick = (event: any) => {
    setSelectedDate(new Date(event.start));
    setView('day');
    window.location.href = '/calendar';
  };
  
  // Calculate event stats
  const eventStats = React.useMemo(() => {
    const now = new Date();
    const todayEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === now.getDate() &&
             eventDate.getMonth() === now.getMonth() &&
             eventDate.getFullYear() === now.getFullYear();
    });
    
    const thisWeekEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });
    
    return {
      today: todayEvents.length,
      week: thisWeekEvents.length,
      total: events.length
    };
  }, [events]);
  
  return (
    <div className="dashboard">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button 
          onClick={handleAddEvent} 
          className="bg-calendar hover:bg-calendar-focus rounded-full"
        >
          <PlusCircle className="h-4 w-4 mr-1" /> Add Event
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-gray-500">Today's Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{eventStats.today}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs p-0 h-auto text-calendar hover:text-calendar-focus"
                onClick={() => navigateToView('day')}
              >
                View Today <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-gray-500">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{eventStats.week}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs p-0 h-auto text-calendar hover:text-calendar-focus"
                onClick={() => navigateToView('week')}
              >
                View Week <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-gray-500">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{eventStats.total}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs p-0 h-auto text-calendar hover:text-calendar-focus"
                onClick={() => navigateToView('agenda')}
              >
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      {/* Main Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MiniCalendar onDateSelect={() => navigateToView('day')} />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <MiniReminders 
            onEventClick={handleEventClick} 
            onViewAll={() => navigateToView('agenda')} 
          />
        </motion.div>
      </div>
      
      {/* Quick Navigation */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="col-span-full"
        >
          <h2 className="text-base font-semibold mb-2">Quick Navigation</h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button 
            variant="outline" 
            className="w-full justify-start border-gray-200 hover:border-calendar"
            onClick={() => navigateToView('day')}
          >
            <Calendar className="h-4 w-4 mr-2 text-calendar" />
            Day View
          </Button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button 
            variant="outline" 
            className="w-full justify-start border-gray-200 hover:border-calendar"
            onClick={() => navigateToView('week')}
          >
            <Calendar className="h-4 w-4 mr-2 text-calendar" />
            Week View
          </Button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button 
            variant="outline" 
            className="w-full justify-start border-gray-200 hover:border-calendar"
            onClick={() => navigateToView('month')}
          >
            <Calendar className="h-4 w-4 mr-2 text-calendar" />
            Month View
          </Button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Button 
            variant="outline" 
            className="w-full justify-start border-gray-200 hover:border-calendar"
            onClick={() => navigateToView('agenda')}
          >
            <LayoutGrid className="h-4 w-4 mr-2 text-calendar" />
            Agenda View
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 