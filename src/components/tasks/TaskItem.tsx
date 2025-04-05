
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarIcon, 
  Clock, 
  Edit, 
  Trash2, 
  FileText,
  AlertCircle,
  Clock3,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onTogglePriority: (taskId: string) => void;
  onAddToCalendar: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggleComplete, 
  onTogglePriority, 
  onAddToCalendar, 
  onEdit, 
  onDelete 
}) => {
  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock3 className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <Star className="h-4 w-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {getPriorityIcon(priority)}
            <span className="ml-1">High</span>
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {getPriorityIcon(priority)}
            <span className="ml-1">Medium</span>
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {getPriorityIcon(priority)}
            <span className="ml-1">Low</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  const getDaysRemaining = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const renderDueDateBadge = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const daysRemaining = getDaysRemaining(dueDate);
    if (daysRemaining === null) return null;
    
    if (daysRemaining < 0) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <Clock className="h-3 w-3 mr-1" />
          Overdue by {Math.abs(daysRemaining)} {Math.abs(daysRemaining) === 1 ? 'day' : 'days'}
        </Badge>
      );
    }
    
    if (daysRemaining === 0) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <Clock className="h-3 w-3 mr-1" />
          Due today
        </Badge>
      );
    }
    
    if (daysRemaining <= 2) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <Clock className="h-3 w-3 mr-1" />
          Due in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <Clock className="h-3 w-3 mr-1" />
        Due in {daysRemaining} days
      </Badge>
    );
  };

  return (
    <div 
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all",
        task.completed 
          ? "bg-gray-50 border-gray-100" 
          : task.priority === 'high'
            ? "bg-white border-red-100 shadow-sm" 
            : task.priority === 'medium'
              ? "bg-white border-amber-100 shadow-sm"
              : "bg-white border-blue-100 shadow-sm",
        "hover:shadow-md"
      )}
    >
      <div className="flex items-start sm:items-center gap-3 flex-1">
        <div className="pt-1 sm:pt-0">
          <Checkbox 
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            className={cn(
              task.completed 
                ? "border-green-500 text-green-500" 
                : task.priority === 'high'
                  ? "border-red-500 text-red-500"
                  : task.priority === 'medium'
                    ? "border-amber-500 text-amber-500"
                    : "border-blue-500 text-blue-500"
            )}
          />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-start flex-wrap gap-2">
            <label 
              htmlFor={`task-${task.id}`}
              className={cn(
                "text-sm font-medium",
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              )}
            >
              {task.title}
            </label>
            
            {task.eventId && (
              <Badge variant="outline" className="bg-calendar-50 text-calendar-700 border-calendar-200">
                <CalendarIcon className="h-3 w-3 mr-1" />
                Calendar
              </Badge>
            )}
            
            {!task.completed && task.dueDate && renderDueDateBadge(task.dueDate)}
            {!task.completed && getPriorityBadge(task.priority)}
          </div>
          
          {task.notes && (
            <div className="flex items-center text-xs text-gray-500">
              <FileText className="h-3 w-3 mr-1" />
              {task.notes}
            </div>
          )}
          
          {task.dueDate && (
            <div className="flex items-center text-xs text-gray-500">
              <CalendarIcon className="h-3 w-3 mr-1" />
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1 mt-2 sm:mt-0">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-500 hover:text-calendar"
          onClick={() => onTogglePriority(task.id)}
          title={`Priority: ${task.priority}`}
        >
          {getPriorityIcon(task.priority)}
        </Button>
        
        {task.dueDate && !task.eventId && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:text-calendar"
            onClick={() => onAddToCalendar(task)}
            title="Add to Calendar"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-500 hover:text-amber-500"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-500 hover:text-red-500"
          onClick={() => onDelete(task.id)}
          title="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
