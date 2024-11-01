import React, { useState } from 'react';
import { Plus, Check, X, Trash2, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
  streak: number;
  color: string;
}

const COLORS = [
  'bg-indigo-500',
  'bg-rose-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-cyan-500',
];

export function Habits() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Read 30 minutes',
      completedDates: [],
      streak: 0,
      color: COLORS[0],
    },
  ]);
  const [newHabit, setNewHabit] = useState('');

  const startDate = startOfWeek(new Date());
  const weekDays = [...Array(7)].map((_, i) => addDays(startDate, i));

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit,
      completedDates: [],
      streak: 0,
      color: COLORS[habits.length % COLORS.length],
    };

    setHabits([...habits, habit]);
    setNewHabit('');
    toast.success('New habit added');
  };

  const toggleHabitCompletion = (habitId: string, date: Date) => {
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;

      const dateStr = date.toISOString();
      let completedDates = habit.completedDates;
      let streak = habit.streak;

      if (completedDates.includes(dateStr)) {
        completedDates = completedDates.filter(d => d !== dateStr);
        streak = Math.max(0, streak - 1);
      } else {
        completedDates = [...completedDates, dateStr];
        streak += 1;
      }

      return { ...habit, completedDates, streak };
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(h => h.id !== habitId));
    toast.success('Habit deleted');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Habit Tracker
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Track your daily habits and build streaks
              </p>
            </div>
          </div>

          <form onSubmit={addHabit} className="mt-6">
            <div className="flex gap-x-4">
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Enter a new habit"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <button
                type="submit"
                className="flex items-center gap-x-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="grid grid-cols-[200px_repeat(7,1fr)] gap-2">
              <div className="text-sm font-medium text-gray-500">Habit</div>
              {weekDays.map(day => (
                <div
                  key={day.toISOString()}
                  className="text-center text-sm font-medium text-gray-500"
                >
                  {format(day, 'EEE')}
                  <div className="text-xs">{format(day, 'MMM d')}</div>
                </div>
              ))}

              {habits.map(habit => (
                <React.Fragment key={habit.id}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${habit.color}`} />
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {habit.name}
                    </span>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="ml-auto text-gray-400 hover:text-gray-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {weekDays.map(day => {
                    const isCompleted = habit.completedDates.some(date =>
                      isSameDay(new Date(date), day)
                    );
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => toggleHabitCompletion(habit.id, day)}
                        className={`flex items-center justify-center h-10 rounded-md border ${
                          isCompleted
                            ? `${habit.color} border-transparent text-white`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300" />
                        )}
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {habits.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {habits.map(habit => (
                  <div
                    key={habit.id}
                    className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${habit.color}`}
                    >
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{habit.name}</h3>
                      <p className="text-sm text-gray-500">
                        {habit.streak} day streak
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}