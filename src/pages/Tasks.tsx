
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { 
  ListTodo, 
  CalendarDays,
  ListChecks
} from 'lucide-react';
import TaskList from '@/components/tasks/TaskList';
import TaskAddForm from '@/components/tasks/TaskAddForm';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskEditDialog from '@/components/tasks/TaskEditDialog';
import { useTasks } from '@/hooks/useTasks';

const Tasks: React.FC = () => {
  const {
    filter,
    isEditingTask,
    currentTask,
    simpleTasks,
    complexTasks,
    setFilter,
    handleAddTask,
    handleToggleComplete,
    handleTogglePriority,
    handleDeleteTask,
    handleAddToCalendar,
    handleEditTask,
    handleUpdateTask,
    setIsEditingTask
  } = useTasks();

  return (
    <div className="tasks-page">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      
      <Card className="mb-6 shadow-sm border-gray-100">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ListTodo className="h-5 w-5 mr-2 text-calendar" />
              Add New Task
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <TaskAddForm onAddTask={handleAddTask} />
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filter Tasks</h2>
        <TaskFilters activeFilter={filter} onFilterChange={setFilter} />
      </div>
      
      <Card className="mb-6 shadow-sm border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <ListChecks className="h-5 w-5 mr-2 text-blue-500" />
            Simple Tasks
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
              {simpleTasks.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TaskList 
            tasks={simpleTasks} 
            filter={filter}
            type="simple"
            onToggleComplete={handleToggleComplete}
            onTogglePriority={handleTogglePriority}
            onAddToCalendar={handleAddToCalendar}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        </CardContent>
      </Card>
      
      <Card className="mb-6 shadow-sm border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <CalendarDays className="h-5 w-5 mr-2 text-amber-500" />
            Scheduled Tasks
            <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700">
              {complexTasks.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TaskList 
            tasks={complexTasks} 
            filter={filter}
            type="scheduled"
            onToggleComplete={handleToggleComplete}
            onTogglePriority={handleTogglePriority}
            onAddToCalendar={handleAddToCalendar}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        </CardContent>
      </Card>

      <TaskEditDialog 
        isOpen={isEditingTask}
        task={currentTask}
        onTaskChange={(updatedTask) => currentTask && updatedTask && updatedTask.id === currentTask.id ? handleUpdateTask(updatedTask) : null}
        onSave={handleUpdateTask}
        onCancel={() => setIsEditingTask(false)}
      />
    </div>
  );
};

export default Tasks;
