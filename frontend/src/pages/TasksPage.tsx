import React, { useState } from 'react';
import { TaskItem, Property } from '../types';
import { api } from '../services/api';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Building2
} from 'lucide-react';

interface TasksPageProps {
  tasks: TaskItem[];
  properties: Property[];
  onRefresh: () => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({ tasks, properties, onRefresh }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleStatus = async (task: TaskItem) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    try {
      await api.updateTaskStatus(task.id, newStatus);
      onRefresh();
    } catch (e: any) {
      alert(`Error updating task: ${e.message}`);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createTask({
        title,
        description,
        priority,
        due_date: dueDate
      });
      setIsAddModalOpen(false);
      setTitle('');
      setDescription('');
      onRefresh();
    } catch (e: any) {
      alert(`Error creating task: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-headline text-surface-900 dark:text-surface-100">
            Operational Tasks & Activities
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            Delegate field inspections, rent follow-ups, and landlord statement deadlines to staff.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-xs uppercase tracking-wider transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map(task => {
          const isDone = task.status === 'done';

          return (
            <div 
              key={task.id}
              className={`p-4 sm:p-5 rounded-2xl border ${
                isDone 
                  ? 'border-surface-200 dark:border-surface-850 bg-surface-50/50 dark:bg-surface-950/50 opacity-60' 
                  : 'border-surface-200 dark:border-surface-850 bg-white dark:bg-surface-900'
              } shadow-2xs flex items-start justify-between gap-4 transition-all`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => handleToggleStatus(task)}
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                    isDone 
                      ? 'bg-emerald-500 border-emerald-500 text-surface-950' 
                      : 'border-surface-300 dark:border-surface-700 hover:border-brand-500'
                  }`}
                >
                  {isDone && <CheckCircle className="w-3.5 h-3.5" />}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold ${isDone ? 'line-through text-surface-400' : 'text-surface-900 dark:text-surface-100'}`}>
                      {task.title}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      task.priority === 'high'
                        ? 'bg-red-500/10 text-red-600'
                        : 'bg-surface-100 dark:bg-surface-800 text-surface-500'
                    }`}>
                      {task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-surface-500 max-w-2xl leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-surface-400 pt-1">
                    <span>Assigned to: <strong className="text-surface-700 dark:text-surface-300">{task.assigned_name}</strong></span>
                    {task.due_date && (
                      <span>• Due: {task.due_date}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp">
            <h3 className="font-headline font-bold text-xl text-surface-900 dark:text-surface-100">
              Create New Task
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deliver formal notice to Flat 2"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional context or checklist..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
