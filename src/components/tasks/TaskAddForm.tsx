
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskAddFormProps {
  onAddTask: (taskTitle: string) => void;
}

const TaskAddForm: React.FC<TaskAddFormProps> = ({ onAddTask }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = () => {
    if (newTaskText.trim() === '') return;
    onAddTask(newTaskText);
    setNewTaskText('');
  };

  return (
    <div className="flex mb-4">
      <Input
        placeholder="Add a new task..."
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        className="mr-2 rounded-full"
      />
      <Button onClick={handleAddTask} className="bg-calendar hover:bg-calendar-focus rounded-full">
        <Plus className="h-4 w-4 mr-1" /> Add
      </Button>
    </div>
  );
};

export default TaskAddForm;
