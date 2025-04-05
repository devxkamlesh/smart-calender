
import React from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { AlertCircle, Clock3, Star } from 'lucide-react';

interface TaskEditDialogProps {
  isOpen: boolean;
  task: Task | null;
  onTaskChange: (task: Task) => void;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({ 
  isOpen, 
  task, 
  onTaskChange, 
  onSave, 
  onCancel 
}) => {
  if (!task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(task);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task Title</Label>
            <Input
              id="task-title"
              value={task.title}
              onChange={(e) => onTaskChange({...task, title: e.target.value})}
              placeholder="Task title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="task-priority">Priority</Label>
            <div className="flex gap-2">
              <Button 
                type="button"
                variant={task.priority === 'high' ? 'default' : 'outline'} 
                className={task.priority === 'high' ? 'bg-red-500 hover:bg-red-600' : ''}
                onClick={() => onTaskChange({...task, priority: 'high'})}
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                High
              </Button>
              <Button 
                type="button"
                variant={task.priority === 'medium' ? 'default' : 'outline'} 
                className={task.priority === 'medium' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                onClick={() => onTaskChange({...task, priority: 'medium'})}
              >
                <Clock3 className="h-4 w-4 mr-1" />
                Medium
              </Button>
              <Button 
                type="button"
                variant={task.priority === 'low' ? 'default' : 'outline'} 
                className={task.priority === 'low' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                onClick={() => onTaskChange({...task, priority: 'low'})}
              >
                <Star className="h-4 w-4 mr-1" />
                Low
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="task-date">Due Date</Label>
            <Input
              id="task-date"
              type="date"
              value={task.dueDate || ''}
              onChange={(e) => onTaskChange({...task, dueDate: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="task-notes">Notes</Label>
            <Textarea
              id="task-notes"
              value={task.notes || ''}
              onChange={(e) => onTaskChange({...task, notes: e.target.value})}
              placeholder="Add notes..."
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog;
