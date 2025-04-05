
import React from 'react';
import { CheckSquare } from 'lucide-react';
import TaskItem from './TaskItem';
import { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  filter: 'all' | 'completed' | 'active';
  type: 'simple' | 'scheduled';
  onToggleComplete: (taskId: string) => void;
  onTogglePriority: (taskId: string) => void;
  onAddToCalendar: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  filter, 
  type,
  onToggleComplete, 
  onTogglePriority, 
  onAddToCalendar, 
  onEdit, 
  onDelete 
}) => {
  if (tasks.length === 0) {
    return (
      <div className="py-10 text-center bg-gray-50 rounded-xl border border-gray-100">
        <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-700 font-medium">No {type} tasks found</p>
        <p className="text-sm text-gray-500 mt-1">
          {filter === 'all' 
            ? `Add some ${type} tasks to get started!` 
            : filter === 'completed' 
              ? `You haven't completed any ${type} tasks yet.` 
              : `All ${type} tasks are completed!`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onTogglePriority={onTogglePriority}
          onAddToCalendar={onAddToCalendar}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
