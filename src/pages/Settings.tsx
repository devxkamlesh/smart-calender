
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { 
  Clock, 
  Calendar as CalendarIcon, 
  Bell, 
  Palette, 
  User, 
  Languages, 
  Save, 
  RefreshCw, 
  ChevronDown
} from 'lucide-react';

const Settings: React.FC = () => {
  // State for all settings
  const [calendarSettings, setCalendarSettings] = useState({
    startWeekMonday: false,
    showPastEvents: true,
    showWorkingHours: true
  });
  
  const [focusSettings, setFocusSettings] = useState({
    focusDuration: "25",
    shortBreak: "5",
    longBreak: "15",
    autoBreak: false,
    autoFocus: false
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    eventReminders: true,
    focusAlerts: true,
    taskReminders: true
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    colorTheme: "purple",
    viewDensity: "default",
    timeFormat: "12"
  });
  
  // Handle save all settings
  const saveAllSettings = () => {
    // In a real application, this would send data to an API
    toast.success("Settings saved successfully!");
    console.log({
      calendarSettings,
      focusSettings,
      notificationSettings,
      appearanceSettings
    });
  };

  return (
    <div className="settings-page pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button onClick={saveAllSettings} className="ml-auto">
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-calendar" />
              Calendar Settings
            </CardTitle>
            <CardDescription>
              Configure how your calendar displays and behaves
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="calendar-weeks">Start week on Monday</Label>
                <div className="text-sm text-muted-foreground">
                  Display Monday as the first day of the week
                </div>
              </div>
              <Switch 
                id="calendar-weeks" 
                checked={calendarSettings.startWeekMonday}
                onCheckedChange={(checked) => setCalendarSettings({...calendarSettings, startWeekMonday: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="calendar-past">Show past events</Label>
                <div className="text-sm text-muted-foreground">
                  Display events that have already occurred
                </div>
              </div>
              <Switch 
                id="calendar-past" 
                checked={calendarSettings.showPastEvents}
                onCheckedChange={(checked) => setCalendarSettings({...calendarSettings, showPastEvents: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="working-hours">Show working hours</Label>
                <div className="text-sm text-muted-foreground">
                  Highlight your working hours in the calendar
                </div>
              </div>
              <Switch 
                id="working-hours" 
                checked={calendarSettings.showWorkingHours}
                onCheckedChange={(checked) => setCalendarSettings({...calendarSettings, showWorkingHours: checked})}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-calendar" />
              Focus Time Settings
            </CardTitle>
            <CardDescription>
              Customize your focus sessions and break timers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="focus-duration">Focus duration</Label>
                <Select 
                  value={focusSettings.focusDuration}
                  onValueChange={(value) => setFocusSettings({...focusSettings, focusDuration: value})}
                >
                  <SelectTrigger id="focus-duration">
                    <SelectValue placeholder="Select minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Minutes</SelectLabel>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="25">25 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="short-break">Short break</Label>
                <Select 
                  value={focusSettings.shortBreak}
                  onValueChange={(value) => setFocusSettings({...focusSettings, shortBreak: value})}
                >
                  <SelectTrigger id="short-break">
                    <SelectValue placeholder="Select minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Minutes</SelectLabel>
                      <SelectItem value="3">3 minutes</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="long-break">Long break</Label>
                <Select 
                  value={focusSettings.longBreak}
                  onValueChange={(value) => setFocusSettings({...focusSettings, longBreak: value})}
                >
                  <SelectTrigger id="long-break">
                    <SelectValue placeholder="Select minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Minutes</SelectLabel>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-break">Auto-start breaks</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically start breaks after focus sessions
                </div>
              </div>
              <Switch 
                id="auto-break" 
                checked={focusSettings.autoBreak}
                onCheckedChange={(checked) => setFocusSettings({...focusSettings, autoBreak: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-focus">Auto-start focus</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically start focus sessions after breaks
                </div>
              </div>
              <Switch 
                id="auto-focus" 
                checked={focusSettings.autoFocus}
                onCheckedChange={(checked) => setFocusSettings({...focusSettings, autoFocus: checked})}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-calendar" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="event-notifications">Event reminders</Label>
                <div className="text-sm text-muted-foreground">
                  Receive notifications before events start
                </div>
              </div>
              <Switch 
                id="event-notifications" 
                checked={notificationSettings.eventReminders}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, eventReminders: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="focus-notifications">Focus time alerts</Label>
                <div className="text-sm text-muted-foreground">
                  Receive notifications when focus sessions start and end
                </div>
              </div>
              <Switch 
                id="focus-notifications" 
                checked={notificationSettings.focusAlerts}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, focusAlerts: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="task-notifications">Task reminders</Label>
                <div className="text-sm text-muted-foreground">
                  Receive notifications for upcoming task deadlines
                </div>
              </div>
              <Switch 
                id="task-notifications" 
                checked={notificationSettings.taskReminders}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, taskReminders: checked})}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-calendar" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your calendar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <Collapsible className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Color Theme</h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      <ChevronDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <RadioGroup 
                    className="grid grid-cols-2 gap-2" 
                    defaultValue={appearanceSettings.colorTheme}
                    onValueChange={(value) => setAppearanceSettings({...appearanceSettings, colorTheme: value})}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="purple" id="theme-purple" />
                      <Label htmlFor="theme-purple" className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-calendar mr-2"></div>
                        Purple
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="blue" id="theme-blue" />
                      <Label htmlFor="theme-blue" className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                        Blue
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="green" id="theme-green" />
                      <Label htmlFor="theme-green" className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                        Green
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="orange" id="theme-orange" />
                      <Label htmlFor="theme-orange" className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                        Orange
                      </Label>
                    </div>
                  </RadioGroup>
                </CollapsibleContent>
              </Collapsible>
              
              <div className="space-y-2">
                <Label htmlFor="view-density">View Density</Label>
                <ToggleGroup type="single" id="view-density" 
                  value={appearanceSettings.viewDensity}
                  onValueChange={(value) => {
                    if (value) setAppearanceSettings({...appearanceSettings, viewDensity: value})
                  }}
                  className="justify-start"
                >
                  <ToggleGroupItem value="compact" aria-label="Compact">Compact</ToggleGroupItem>
                  <ToggleGroupItem value="default" aria-label="Default">Default</ToggleGroupItem>
                  <ToggleGroupItem value="relaxed" aria-label="Relaxed">Relaxed</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-format">Time Format</Label>
                <ToggleGroup type="single" id="time-format" 
                  value={appearanceSettings.timeFormat}
                  onValueChange={(value) => {
                    if (value) setAppearanceSettings({...appearanceSettings, timeFormat: value})
                  }}
                  className="justify-start"
                >
                  <ToggleGroupItem value="12" aria-label="12-hour">12-hour (AM/PM)</ToggleGroupItem>
                  <ToggleGroupItem value="24" aria-label="24-hour">24-hour</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
          <Button onClick={saveAllSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
