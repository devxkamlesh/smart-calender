import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useCalendar } from '@/context/CalendarContext';
import { format, isAfter, addDays, addWeeks, addMonths, parse } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  X, 
  AlertCircle, 
  MapPin, 
  Clock, 
  Calendar as CalendarIcon, 
  Trash2, 
  Bell,
  Repeat,
  Palette,
  Users,
  Home,
  Target,
  FileText,
  MoreHorizontal
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingEvent?: any;
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
    case 'work': return <Users className="h-4 w-4" />;
    case 'personal': return <Home className="h-4 w-4" />;
    case 'focus': return <Target className="h-4 w-4" />;
    case 'other': return <FileText className="h-4 w-4" />;
  }
};

const EventForm: React.FC<EventFormProps> = ({ isOpen, onClose, editingEvent }) => {
  const { addEvent, editEvent, removeEvent, selectedDate } = useCalendar();
  const [activeTab, setActiveTab] = useState('basic');
  const [showRecurring, setShowRecurring] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Initialize form with default values or editing event values
  const { register, handleSubmit, formState: { errors }, reset, setValue, control, watch } = useForm({
    defaultValues: editingEvent || {
      title: '',
      type: 'work',
      start: format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
      end: format(new Date(selectedDate.getTime() + 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
      location: '',
      description: '',
      isRecurring: false,
      recurrence: {
        frequency: 'weekly',
        interval: 1,
        ends: 'never',
        count: 10,
        endDate: format(addMonths(selectedDate, 1), "yyyy-MM-dd")
      }
    }
  });

  const currentValues = watch();
  const isRecurring = watch('isRecurring');

  React.useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        // Format dates for input elements
        setValue('start', format(new Date(editingEvent.start), "yyyy-MM-dd'T'HH:mm"));
        setValue('end', format(new Date(editingEvent.end), "yyyy-MM-dd'T'HH:mm"));
        setShowRecurring(editingEvent.isRecurring || false);
      } else {
        reset({
          title: '',
          type: 'work',
          start: format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
          end: format(new Date(selectedDate.getTime() + 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
          location: '',
          description: '',
          isRecurring: false,
          recurrence: {
            frequency: 'weekly',
            interval: 1,
            ends: 'never',
            count: 10,
            endDate: format(addMonths(selectedDate, 1), "yyyy-MM-dd")
          }
        });
        setShowRecurring(false);
        setConfirmDelete(false);
      }
      setActiveTab('basic');
    }
  }, [isOpen, editingEvent, selectedDate, reset, setValue]);

  const handleDelete = () => {
    if (confirmDelete && editingEvent) {
      removeEvent(editingEvent.id);
      onClose();
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  const validateDates = () => {
    const startDate = new Date(currentValues.start);
    const endDate = new Date(currentValues.end);
    return isAfter(endDate, startDate) || "End time must be after start time";
  };

  const onSubmit = (data: any) => {
    const eventData = {
      ...data,
      start: new Date(data.start),
      end: new Date(data.end),
      type: data.type || 'work'
    };

    if (editingEvent) {
      editEvent({ ...eventData, id: editingEvent.id });
    } else {
      addEvent(eventData);
    }
    
    onClose();
    setConfirmDelete(false);
  };

  const eventTypes = [
    { value: 'work', label: 'Work', color: '#ef4444', emoji: '💼' },
    { value: 'personal', label: 'Personal', color: '#3b82f6', emoji: '🏠' },
    { value: 'focus', label: 'Focus Time', color: '#f59e0b', emoji: '🎯' },
    { value: 'other', label: 'Other', color: '#a855f7', emoji: '📝' }
  ];

  // Quick duration options
  const quickDurations = [
    { label: '15m', minutes: 15 },
    { label: '30m', minutes: 30 },
    { label: '1h', minutes: 60 },
    { label: '2h', minutes: 120 },
    { label: 'All day', allDay: true }
  ];

  const handleQuickDuration = (duration: { minutes?: number, allDay?: boolean }) => {
    const startDate = new Date(currentValues.start);
    
    if (duration.allDay) {
      // Set as all day event (midnight to midnight)
      const startAllDay = new Date(startDate);
      startAllDay.setHours(0, 0, 0, 0);
      
      const endAllDay = new Date(startAllDay);
      endAllDay.setHours(23, 59, 0, 0);
      
      setValue('start', format(startAllDay, "yyyy-MM-dd'T'HH:mm"));
      setValue('end', format(endAllDay, "yyyy-MM-dd'T'HH:mm"));
    } else if (duration.minutes) {
      const endDate = new Date(startDate.getTime() + duration.minutes * 60 * 1000);
      setValue('end', format(endDate, "yyyy-MM-dd'T'HH:mm"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="overflow-y-auto max-h-[85vh]">
          <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 bg-white z-10">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
        </DialogHeader>
        
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Tabs 
              defaultValue="basic" 
              className="w-full" 
              value={activeTab} 
              onValueChange={setActiveTab}
            >
              <div className="px-6 border-b">
                <TabsList className="grid w-full grid-cols-3 mb-0">
                  <TabsTrigger value="basic" className="rounded-b-none rounded-t-lg">
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="details" className="rounded-b-none rounded-t-lg">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="recurrence" className="rounded-b-none rounded-t-lg">
                    Recurrence
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Basic Info Tab */}
              <TabsContent value="basic" className="px-6 py-4 space-y-4 m-0">
          <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="title" className="required">Event Title</Label>
                    <div className="ml-auto flex gap-2">
                      <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                          <div className="flex space-x-1">
                            {eventTypes.map(type => (
                              <TooltipProvider key={type.value}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all focus:outline-none",
                                        field.value === type.value 
                                          ? "ring-2 ring-offset-2" 
                                          : "opacity-60 hover:opacity-100"
                                      )}
                                      style={{ 
                                        backgroundColor: type.color,
                                        boxShadow: field.value === type.value ? `0 0 0 2px white, 0 0 0 4px ${type.color}` : 'none'
                                      }}
                                      onClick={() => field.onChange(type.value)}
                                    >
                                      <span className="text-white text-sm">{type.emoji}</span>
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{type.label}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                          </div>
                        )}
                      />
                    </div>
                  </div>
            <Input
              id="title"
              placeholder="Enter event title"
                    className="focus-visible:ring-calendar"
                    {...register('title', { required: "Title is required" })}
            />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title.message as string}</p>
                  )}
          </div>
          
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                    <Label htmlFor="start" className="required">Start Time</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="start"
                type="datetime-local"
                        className="pl-9 focus-visible:ring-calendar"
                        {...register('start', { required: "Start time is required" })}
              />
                    </div>
                    {errors.start && (
                      <p className="text-red-500 text-sm">{errors.start.message as string}</p>
                    )}
            </div>
            <div className="space-y-2">
                    <Label htmlFor="end" className="required">End Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="end"
                type="datetime-local"
                        className="pl-9 focus-visible:ring-calendar"
                        {...register('end', { 
                          required: "End time is required",
                          validate: validateDates
                        })}
              />
            </div>
                    {errors.end && (
                      <p className="text-red-500 text-sm">{errors.end.message as string}</p>
                    )}
                  </div>
                </div>

                {/* Quick duration buttons */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Label className="w-full text-xs text-gray-500">Quick Duration:</Label>
                  {quickDurations.map((duration, index) => (
                    <Button 
                      key={index}
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleQuickDuration(duration)}
                      className="text-xs h-7"
                    >
                      {duration.label}
                    </Button>
                  ))}
                </div>
                
                {/* Quick date buttons */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Label className="w-full text-xs text-gray-500">Quick Date:</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const now = new Date();
                      setValue('start', format(now, "yyyy-MM-dd'T'HH:mm"));
                      setValue('end', format(new Date(now.getTime() + 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"));
                    }}
                    className="text-xs h-7"
                  >
                    Today
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const tomorrow = addDays(new Date(), 1);
                      tomorrow.setHours(9, 0, 0, 0);
                      setValue('start', format(tomorrow, "yyyy-MM-dd'T'HH:mm"));
                      setValue('end', format(new Date(tomorrow.getTime() + 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"));
                    }}
                    className="text-xs h-7"
                  >
                    Tomorrow
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const nextWeek = addWeeks(new Date(), 1);
                      nextWeek.setHours(9, 0, 0, 0);
                      setValue('start', format(nextWeek, "yyyy-MM-dd'T'HH:mm"));
                      setValue('end', format(new Date(nextWeek.getTime() + 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"));
                    }}
                    className="text-xs h-7"
                  >
                    Next Week
                  </Button>
          </div>
          
                {/* Recurring event toggle */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Repeat className="h-4 w-4 text-gray-500" />
                    <Label htmlFor="recurring-event" className="cursor-pointer">
                      Recurring Event
                    </Label>
                  </div>
                  <Switch
                    id="recurring-event"
                    checked={isRecurring}
                    onCheckedChange={(checked) => {
                      setValue('isRecurring', checked);
                      if (checked) {
                        setActiveTab('recurrence');
                      }
                    }}
                  />
          </div>
          
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <Label htmlFor="set-reminder" className="cursor-pointer">
                      Set Reminder
                    </Label>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    type="button"
                    onClick={() => setActiveTab('details')}
                  >
                    Configure
                  </Button>
                </div>
              </TabsContent>
              
              {/* Details Tab */}
              <TabsContent value="details" className="px-6 py-4 space-y-4 m-0">
          <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              id="location"
                      placeholder="Add a location"
                      className="pl-9 focus-visible:ring-calendar"
              {...register('location')}
            />
                  </div>
          </div>
          
          <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
                    placeholder="Add a description or notes"
                    className="min-h-[120px] focus-visible:ring-calendar"
              {...register('description')}
            />
          </div>
          
                {/* Reminder options */}
                <div className="space-y-3 pt-2 border-t">
                  <Label className="text-sm flex items-center gap-1.5">
                    <Bell className="h-4 w-4 text-gray-500" />
                    Reminders
                  </Label>
                  
                  <RadioGroup defaultValue="15">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="r1" />
                      <Label htmlFor="r1">No reminder</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="15" id="r2" />
                      <Label htmlFor="r2">15 minutes before</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30" id="r3" />
                      <Label htmlFor="r3">30 minutes before</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="60" id="r4" />
                      <Label htmlFor="r4">1 hour before</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1440" id="r5" />
                      <Label htmlFor="r5">1 day before</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Visibility / status */}
                <div className="space-y-3 pt-2 border-t">
                  <Label className="text-sm">Status</Label>
                  <RadioGroup defaultValue="busy">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="busy" id="s1" />
                      <Label htmlFor="s1">Busy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="free" id="s2" />
                      <Label htmlFor="s2">Free</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tentative" id="s3" />
                      <Label htmlFor="s3">Tentative</Label>
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>
              
              {/* Recurrence Tab */}
              <TabsContent value="recurrence" className="px-6 py-4 space-y-4 m-0">
                <div className="space-y-3">
                  <Label>Repeat Frequency</Label>
                  <Controller
                    control={control}
                    name="recurrence.frequency"
                    render={({ field }) => (
                      <RadioGroup 
                        value={field.value}
                        onValueChange={field.onChange}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="daily" id="f1" />
                          <Label htmlFor="f1">Daily</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="weekly" id="f2" />
                          <Label htmlFor="f2">Weekly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="f3" />
                          <Label htmlFor="f3">Monthly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yearly" id="f4" />
                          <Label htmlFor="f4">Yearly</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Repeat every</Label>
                  <div className="flex items-center space-x-2">
                    <Controller
                      control={control}
                      name="recurrence.interval"
                      render={({ field }) => (
                        <Input
                          type="number"
                          min={1}
                          max={99}
                          className="w-20"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      )}
                    />
                    <span className="text-sm">
                      {watch('recurrence.frequency') === 'daily' && 'days'}
                      {watch('recurrence.frequency') === 'weekly' && 'weeks'}
                      {watch('recurrence.frequency') === 'monthly' && 'months'}
                      {watch('recurrence.frequency') === 'yearly' && 'years'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 pt-3 border-t">
                  <Label>Ends</Label>
                  <Controller
                    control={control}
                    name="recurrence.ends"
                    render={({ field }) => (
                      <RadioGroup 
                        value={field.value} 
                        onValueChange={field.onChange}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="never" id="e1" />
                          <Label htmlFor="e1">Never</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="after" id="e2" />
                          <div className="flex items-center gap-2">
                            <Label htmlFor="e2">After</Label>
                            <Controller
                              control={control}
                              name="recurrence.count"
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  min={1}
                                  max={999}
                                  className="w-20"
                                  disabled={watch('recurrence.ends') !== 'after'}
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              )}
                            />
                            <span className="text-sm">occurrences</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="on" id="e3" />
                          <div className="flex items-center gap-2">
                            <Label htmlFor="e3">On</Label>
                            <Controller
                              control={control}
                              name="recurrence.endDate"
                              render={({ field }) => (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-[200px] justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                        watch('recurrence.ends') !== 'on' && "opacity-50"
                                      )}
                                      disabled={watch('recurrence.ends') !== 'on'}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={field.value ? new Date(field.value) : undefined}
                                      onSelect={(date) => {
                                        if (date) field.onChange(format(date, "yyyy-MM-dd"));
                                      }}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              )}
                            />
                          </div>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="px-6 py-4 border-t flex-col sm:flex-row gap-2">
              <div className="flex justify-between w-full items-center">
                {editingEvent ? (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleDelete}
                    size="sm"
                    className={cn(confirmDelete && "animate-pulse")}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> 
                    {confirmDelete ? "Confirm Delete" : "Delete"}
                  </Button>
                ) : (
                  <div />
                )}
                <div className="space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-calendar hover:bg-calendar-focus">
              {editingEvent ? 'Update Event' : 'Add Event'}
            </Button>
                </div>
              </div>
          </DialogFooter>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
