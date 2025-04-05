
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  activeFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onFilterChange('all')}
        className={cn(
          "rounded-full px-4",
          activeFilter === 'all' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''
        )}
      >
        All
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onFilterChange('active')}
        className={cn(
          "rounded-full px-4",
          activeFilter === 'active' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''
        )}
      >
        Active
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onFilterChange('completed')}
        className={cn(
          "rounded-full px-4",
          activeFilter === 'completed' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''
        )}
      >
        Completed
      </Button>
    </div>
  );
};

export default TaskFilters;
