
import { useState, useEffect } from 'react';
import { useCalendar } from '@/context/CalendarContext';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';

export const useTasks = () => {
  const { events, addEvent, editEvent, removeEvent } = useCalendar();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Error parsing tasks from localStorage:", e);
        setTasks([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const taskEventIds = tasks.filter(task => task.eventId).map(task => task.eventId);
    
    const newEvents = events.filter(event => 
      !taskEventIds.includes(event.id)
    );
    
    if (newEvents.length > 0) {
      const newTasks = newEvents.map(event => {
        return {
          id: `task-${event.id}`,
          title: event.title,
          completed: false,
          priority: mapEventTypeToPriority(event.type),
          dueDate: format(event.start, 'yyyy-MM-dd'),
          notes: event.description || undefined,
          eventId: event.id
        };
      });
      
      setTasks(prev => [...prev, ...newTasks]);
      toast({
        title: "Calendar Sync",
        description: `${newEvents.length} events added to tasks.`,
      });
    }
  }, [events, tasks, toast]);

  const mapEventTypeToPriority = (type: string): 'high' | 'medium' | 'low' => {
    switch (type) {
      case 'work': return 'high';
      case 'focus': return 'medium';
      case 'personal': return 'low';
      default: return 'medium';
    }
  };

  const mapPriorityToEventType = (priority: 'high' | 'medium' | 'low'): "work" | "personal" | "focus" | "other" => {
    switch (priority) {
      case 'high': return 'work';
      case 'medium': return 'focus';
      case 'low': return 'personal';
      default: return 'other';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    return !task.completed;
  });

  const simpleTasks = filteredTasks.filter(task => !task.dueDate);
  const complexTasks = filteredTasks.filter(task => task.dueDate);

  const handleAddTask = (taskTitle: string) => {
    const newTask: Task = {
      id: `task-${Date.now().toString()}`,
      title: taskTitle,
      completed: false,
      priority: 'medium'
    };
    
    setTasks([...tasks, newTask]);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleTogglePriority = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
        const currentIndex = priorities.indexOf(task.priority);
        const nextIndex = (currentIndex + 1) % priorities.length;
        const newPriority = priorities[nextIndex];
        
        if (task.eventId) {
          const associatedEvent = events.find(event => event.id === task.eventId);
          if (associatedEvent) {
            editEvent({
              ...associatedEvent,
              type: mapPriorityToEventType(newPriority)
            });
          }
        }
        
        return { ...task, priority: newPriority };
      }
      return task;
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    
    if (taskToDelete?.eventId) {
      removeEvent(taskToDelete.eventId);
    }
    
    setTasks(tasks.filter(task => task.id !== taskId));
    
    toast({
      title: "Task Deleted",
      description: "The task has been removed successfully."
    });
  };

  const handleAddToCalendar = (task: Task) => {
    if (!task.dueDate) {
      toast({
        title: "Cannot Add to Calendar",
        description: "This task doesn't have a due date.",
        variant: "destructive"
      });
      return;
    }
    
    if (task.eventId) {
      toast({
        title: "Already in Calendar",
        description: "This task is already linked to a calendar event."
      });
      return;
    }
    
    const dueDate = new Date(task.dueDate);
    const endTime = new Date(dueDate);
    endTime.setHours(endTime.getHours() + 1);
    
    const newEvent = {
      title: task.title,
      start: dueDate,
      end: endTime,
      type: mapPriorityToEventType(task.priority),
      description: task.notes,
      location: ""
    };
    
    addEvent(newEvent);
    
    const createdEvent = events[events.length - 1];
    
    setTasks(tasks.map(t => 
      t.id === task.id ? { ...t, eventId: createdEvent.id } : t
    ));
    
    toast({
      title: "Added to Calendar",
      description: "Task has been added to your calendar."
    });
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsEditingTask(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    
    // Update calendar event if this task is linked to one
    if (updatedTask.eventId) {
      const associatedEvent = events.find(event => event.id === updatedTask.eventId);
      if (associatedEvent) {
        let dueDate = new Date();
        if (updatedTask.dueDate) {
          dueDate = new Date(updatedTask.dueDate);
        }
        
        const endTime = new Date(dueDate);
        endTime.setHours(endTime.getHours() + 1);
        
        editEvent({
          ...associatedEvent,
          title: updatedTask.title,
          type: mapPriorityToEventType(updatedTask.priority),
          description: updatedTask.notes,
          start: dueDate,
          end: endTime
        });
      }
    }
    
    setIsEditingTask(false);
    setCurrentTask(null);
    
    toast({
      title: "Task Updated",
      description: "Task has been updated successfully."
    });
  };

  return {
    tasks,
    filter,
    isEditingTask,
    currentTask,
    simpleTasks,
    complexTasks,
    setFilter,
    setCurrentTask,
    setIsEditingTask,
    handleAddTask,
    handleToggleComplete,
    handleTogglePriority,
    handleDeleteTask,
    handleAddToCalendar,
    handleEditTask,
    handleUpdateTask
  };
};
