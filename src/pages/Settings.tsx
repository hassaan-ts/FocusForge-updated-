import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export function Settings() {
  const [schedule, setSchedule] = useState({
    startTime: '09:00',
    endTime: '17:00',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API integration
    toast.success('Focus schedule updated');
  };

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Focus Schedule
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Set your daily focus hours
                </p>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Start Time
                </label>
                <div className="mt-2">
                  <input
                    type="time"
                    name="startTime"
                    id="startTime"
                    value={schedule.startTime}
                    onChange={(e) =>
                      setSchedule({ ...schedule, startTime: e.target.value })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  End Time
                </label>
                <div className="mt-2">
                  <input
                    type="time"
                    name="endTime"
                    id="endTime"
                    value={schedule.endTime}
                    onChange={(e) =>
                      setSchedule({ ...schedule, endTime: e.target.value })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label className="text-sm font-medium leading-6 text-gray-900">
                  Active Days
                </label>
                <div className="mt-4 space-y-4">
                  {days.map((day) => (
                    <div key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={schedule.days.includes(day.toLowerCase())}
                        onChange={(e) => {
                          const dayLower = day.toLowerCase();
                          setSchedule({
                            ...schedule,
                            days: e.target.checked
                              ? [...schedule.days, dayLower]
                              : schedule.days.filter((d) => d !== dayLower),
                          });
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label className="ml-3 text-sm leading-6 text-gray-600">
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="submit"
              className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Clock className="h-4 w-4" />
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}