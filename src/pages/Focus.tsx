
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Bell, 
  BellOff,
  Settings,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const Focus: React.FC = () => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [focusMode, setFocusMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [cycles, setCycles] = useState(0);
  const [notifications, setNotifications] = useState(true);
  
  useEffect(() => {
    let interval: any = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => {
          if (time <= 1) {
            clearInterval(interval);
            handleTimerComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const handleTimerComplete = () => {
    setIsActive(false);
    setIsPaused(false);
    
    if (notifications) {
      toast({
        title: `${focusMode === 'focus' ? 'Focus session' : 'Break'} complete!`,
        description: "Time for a new session.",
      });
    }
    
    if (focusMode === 'focus') {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      
      if (newCycles % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      switchMode('focus');
    }
  };

  const switchMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setFocusMode(mode);
    
    if (mode === 'focus') {
      setTime(25 * 60);
      setInitialTime(25 * 60);
    } else if (mode === 'shortBreak') {
      setTime(5 * 60);
      setInitialTime(5 * 60);
    } else {
      setTime(15 * 60);
      setInitialTime(15 * 60);
    }
  };

  const handleStartPause = () => {
    if (isActive) {
      setIsPaused(!isPaused);
    } else {
      setIsActive(true);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(initialTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderFocusTips = () => {
    const tips = [
      "Close distracting apps and websites",
      "Put your phone on silent mode",
      "Clear your workspace of clutter",
      "Use noise-cancelling headphones if needed",
      "Keep a glass of water nearby",
      "Write down any distracting thoughts to address later"
    ];
    
    return tips.map((tip, index) => (
      <li key={index} className="flex items-start mb-2">
        <span className="bg-calendar-subtle text-calendar font-medium rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">
          {index + 1}
        </span>
        <span className="text-sm">{tip}</span>
      </li>
    ));
  };

  return (
    <div className="focus-page">
      <h1 className="text-2xl font-bold mb-6">Focus Time</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 glass-card">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                {focusMode === 'focus' ? 'Focus Session' : focusMode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </CardTitle>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setNotifications(!notifications)}
                      >
                        {notifications ? (
                          <Bell className="h-4 w-4" />
                        ) : (
                          <BellOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{notifications ? 'Disable' : 'Enable'} notifications</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Timer settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-7xl font-bold mb-6 font-mono">
                {formatTime(time)}
              </div>
              
              <Progress 
                value={time / initialTime * 100} 
                className="w-full max-w-md h-2 mb-8" 
              />
              
              <div className="flex space-x-3">
                <Button 
                  onClick={handleStartPause}
                  className={`px-6 ${isActive && !isPaused ? 'bg-orange-500 hover:bg-orange-600' : 'bg-calendar hover:bg-calendar-focus'}`}
                >
                  {isActive && !isPaused ? (
                    <><Pause className="h-4 w-4 mr-2" /> Pause</>
                  ) : isActive && isPaused ? (
                    <><Play className="h-4 w-4 mr-2" /> Resume</>
                  ) : (
                    <><Play className="h-4 w-4 mr-2" /> Start</>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  disabled={!isActive && time === initialTime}
                >
                  Reset
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    handleReset();
                    if (focusMode === 'focus') {
                      switchMode('shortBreak');
                    } else {
                      switchMode('focus');
                    }
                  }}
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Skip
                </Button>
              </div>
              
              <div className="flex gap-4 mt-8">
                <Button 
                  variant="outline" 
                  className={focusMode === 'focus' ? 'bg-calendar-subtle text-calendar border-calendar' : ''}
                  onClick={() => {
                    handleReset();
                    switchMode('focus');
                  }}
                >
                  Focus (25m)
                </Button>
                <Button 
                  variant="outline"
                  className={focusMode === 'shortBreak' ? 'bg-calendar-subtle text-calendar border-calendar' : ''}
                  onClick={() => {
                    handleReset();
                    switchMode('shortBreak');
                  }}
                >
                  Short Break (5m)
                </Button>
                <Button 
                  variant="outline"
                  className={focusMode === 'longBreak' ? 'bg-calendar-subtle text-calendar border-calendar' : ''}
                  onClick={() => {
                    handleReset();
                    switchMode('longBreak');
                  }}
                >
                  Long Break (15m)
                </Button>
              </div>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Cycle: </span> 
                {Math.floor(cycles / 4) + 1}, 
                <span className="font-medium text-foreground"> Session: </span> 
                {(cycles % 4) + 1} of 4
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-calendar" />
              Focus Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-2">
              <ul className="space-y-1">
                {renderFocusTips()}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Focus;
