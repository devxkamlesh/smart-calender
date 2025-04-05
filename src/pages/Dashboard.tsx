import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalendar } from '@/context/CalendarContext';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Star, ListTodo, Bell, TrendingUp, TrendingDown, BarChart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const Dashboard: React.FC = () => {
  const { events = [] } = useCalendar();
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Get today's events
  const todayEvents = events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  // Get upcoming events (next 7 days excluding today)
  const upcomingEvents = events.filter(event => {
    const eventDate = format(event.start, 'yyyy-MM-dd');
    const today = format(new Date(), 'yyyy-MM-dd');
    const sevenDaysLater = format(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd');
    
    return eventDate > today && eventDate <= sevenDaysLater;
  }).slice(0, 5);

  // Calculate focus time hours for the week
  const focusTimeHours = events
    .filter(event => event.type === 'focus')
    .reduce((total, event) => {
      const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
      return total + duration;
    }, 0);

  useEffect(() => {
    // Show welcome toast on initial load
    if (showWelcome) {
      toast({
        title: "Welcome back!",
        description: `You have ${todayEvents.length} events scheduled for today.`,
        duration: 5000,
      });
      setShowWelcome(false);
    }
  }, [showWelcome, todayEvents.length, toast, events]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="dashboard min-h-screen bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-calendar to-purple-500 bg-clip-text text-transparent">Smart Calendar Dashboard</h1>
          <div className="flex gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" className="flex gap-2 shadow-sm border-calendar/20 text-calendar hover:bg-calendar/10">
                <Plus className="h-4 w-4" />
                <span>New Event</span>
              </Button>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="default" className="flex gap-2 shadow-sm bg-calendar hover:bg-calendar/90">
                <Link to="/calendar">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Open Calendar</span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="h-full">
            <Card className="rounded-xl overflow-hidden shadow-md h-full border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-800">
              <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-md font-semibold flex items-center text-gray-800 dark:text-gray-200">
                  <CalendarIcon className="h-5 w-5 mr-2 text-calendar" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  {format(new Date(), 'EEEE, MMMM d')}
                </p>
                {todayEvents.length > 0 ? (
                  <div className="space-y-3">
                    {todayEvents.map(event => (
                      <motion.div 
                        key={event.id} 
                        className="relative p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
                        whileHover={{ scale: 1.02, x: 5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={`absolute top-0 bottom-0 left-0 w-1 rounded-l-lg bg-calendar-event-${event.type}`} />
                        <p className="font-medium text-gray-800 dark:text-gray-200">{event.title}</p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                      <CalendarIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-muted-foreground text-sm">No events scheduled today</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Your schedule is clear!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item} className="h-full">
            <Card className="rounded-xl overflow-hidden shadow-md h-full border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-800">
              <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-md font-semibold flex items-center text-gray-800 dark:text-gray-200">
                  <Clock className="h-5 w-5 mr-2 text-calendar" />
                  Weekly Focus Time
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col items-center justify-center py-4">
                  <motion.div 
                    className="relative mb-4"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, type: "spring" }}
                  >
                    <div className="w-32 h-32 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 shadow-inner">
                      <span className="text-4xl font-bold bg-gradient-to-r from-calendar to-purple-500 bg-clip-text text-transparent">
                        {focusTimeHours.toFixed(1)}
                      </span>
                    </div>
                    <motion.div 
                      className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <Clock className="h-4 w-4 text-calendar" />
                    </motion.div>
                  </motion.div>
                  
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-6">Hours focused this week</p>
                  
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Current</span>
                      <span>Goal: 15h</span>
                    </div>
                    <Progress 
                      value={Math.min(focusTimeHours / 15 * 100, 100)} 
                      className="h-2 bg-gray-200 dark:bg-gray-700" 
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      {focusTimeHours < 15 
                        ? `${(15 - focusTimeHours).toFixed(1)} hours to reach your goal` 
                        : "Goal achieved! 🎉"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item} className="h-full">
            <Card className="rounded-xl overflow-hidden shadow-md h-full border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-800">
              <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-md font-semibold flex items-center text-gray-800 dark:text-gray-200">
                  <Star className="h-5 w-5 mr-2 text-calendar" />
                  Smart Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <motion.div 
                    className="relative p-4 rounded-lg border border-calendar-subtle bg-white dark:bg-gray-700 shadow-sm overflow-hidden"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-calendar-subtle/20 dark:bg-gray-600/20 rounded-full -mr-10 -mt-10" />
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Schedule focus time</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">You're most productive in the mornings</p>
                    <Button variant="outline" size="sm" className="w-full border-calendar text-calendar hover:bg-calendar hover:text-white">
                      Block 9-11 AM tomorrow
                    </Button>
                  </motion.div>
                  
                  <motion.div 
                    className="relative p-4 rounded-lg border border-calendar-event-personal/40 bg-white dark:bg-gray-700 shadow-sm overflow-hidden"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-calendar-event-personal/10 dark:bg-gray-600/20 rounded-full -mr-10 -mt-10" />
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Time for a break?</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">You haven't scheduled any personal time</p>
                    <Button variant="outline" size="sm" className="w-full border-calendar-event-personal/40 text-calendar-focus dark:text-calendar-event-personal hover:bg-calendar-event-personal/40 hover:text-gray-800">
                      Find a good time
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <Card className="rounded-xl overflow-hidden shadow-md border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-800">
              <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-md font-semibold flex items-center text-gray-800 dark:text-gray-200">
                    <CalendarIcon className="h-5 w-5 mr-2 text-calendar" />
                    Upcoming Events
                  </CardTitle>
                  <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-calendar hover:text-calendar hover:bg-calendar/10">
                    <Link to="/calendar">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.map(event => (
                      <motion.div 
                        key={event.id} 
                        className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                        whileHover={{ x: 5 }}
                      >
                        <div className={`w-1 flex-shrink-0 self-stretch rounded-full bg-calendar-event-${event.type} mr-3`}></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-calendar transition-colors">{event.title}</p>
                          <div className="flex items-center flex-wrap text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {format(event.start, 'EEE, MMM d')}
                            <span className="mx-1">•</span>
                            <Clock className="h-3 w-3 mr-1" />
                            {format(event.start, 'h:mm a')}
                          </div>
                          {event.location && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                              <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {event.location}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                      <CalendarIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-muted-foreground text-sm dark:text-gray-300">No upcoming events</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Your next 7 days look clear</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="rounded-xl overflow-hidden shadow-md border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-800">
              <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-md font-semibold flex items-center text-gray-800 dark:text-gray-200">
                    <ListTodo className="h-5 w-5 mr-2 text-calendar" />
                    Tasks Overview
                  </CardTitle>
                  <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-calendar hover:text-calendar hover:bg-calendar/10">
                    <Link to="/tasks">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3 mb-6">
                  <motion.div 
                    className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 flex justify-between items-center hover:shadow-md transition-all bg-white dark:bg-gray-800"
                    whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded border border-orange-400 dark:border-orange-500 flex items-center justify-center text-orange-400 dark:text-orange-500">
                        <TrendingUp className="h-3 w-3" />
                      </div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Complete quarterly report</p>
                    </div>
                    <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 px-2 py-0.5 rounded-full">
                      High
                    </span>
                  </motion.div>
                  
                  <motion.div 
                    className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 flex justify-between items-center hover:shadow-md transition-all bg-white dark:bg-gray-800"
                    whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded border border-yellow-400 dark:border-yellow-500 flex items-center justify-center text-yellow-400 dark:text-yellow-500">
                        <BarChart className="h-3 w-3" />
                      </div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Review team project plan</p>
                    </div>
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                      Medium
                    </span>
                  </motion.div>
                  
                  <motion.div 
                    className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 flex justify-between items-center hover:shadow-md transition-all bg-white dark:bg-gray-800"
                    whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded border border-green-400 dark:border-green-500 flex items-center justify-center text-green-400 dark:text-green-500">
                        <TrendingDown className="h-3 w-3" />
                      </div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Prepare for client meeting</p>
                    </div>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-0.5 rounded-full">
                      Low
                    </span>
                  </motion.div>
                </div>
                
                <div className="flex justify-center">
                  <Button asChild variant="outline" 
                    className="border-calendar text-calendar hover:bg-calendar hover:text-white transition-colors shadow-sm"
                  >
                    <Link to="/tasks" className="flex items-center gap-2">
                      <ListTodo className="h-4 w-4" />
                      <span>Manage Tasks</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          y: [0, -5, 0],
          boxShadow: [
            "0 4px 6px -1px rgba(0, 0, 0, 0.1)", 
            "0 10px 15px -3px rgba(0, 0, 0, 0.1)", 
            "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          ]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
      >
        <Button 
          size="icon" 
          className="rounded-full h-14 w-14 bg-calendar hover:bg-calendar/90 text-white shadow-lg"
        >
          <Bell className="h-6 w-6" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
