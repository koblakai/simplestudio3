
import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Clock, User, MapPin } from 'lucide-react';

interface ClassItem {
  id: string;
  title: string;
  instructor: string;
  start: string;
  room: string;
  capacity: number;
}

const ClassSchedule: React.FC = () => {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const classes: ClassItem[] = [
    {
      id: '1',
      title: 'Hatha',
      instructor: 'Lindsey Pierce',
      start: '2024-10-24T10:00:00',
      room: 'Yoga Studio 2',
      capacity: 30
    },
    {
      id: '2',
      title: 'Slow Flow Vinyasa',
      instructor: 'Lindsey Pierce',
      start: '2024-10-24T11:00:00',
      room: 'Yoga Studio 2',
      capacity: 30
    },
    {
      id: '3',
      title: 'Slow Flow Vinyasa',
      instructor: 'Lindsey Pierce',
      start: '2024-10-25T10:00:00',
      room: 'Yoga Studio 2',
      capacity: 30
    }
  ];

  const getClassesForDay = (day: Date): ClassItem[] => {
    return classes.filter(classItem => 
      isSameDay(new Date(classItem.start), day)
    ).sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  };

  const handleBooking = (classId: string) => {
    console.log('Booking class:', classId);
    // Implement booking logic here
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Class Schedule</h2>
      <h3 className="text-2xl font-bold mb-6">This Week's Classes</h3>
      
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="text-center">
            <div className="mb-4">
              <div className="font-semibold text-lg">{format(day, 'EEEE')}</div>
              <div className="text-gray-500">{format(day, 'MMM d')}</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              {getClassesForDay(day).length > 0 ? (
                getClassesForDay(day).map((classItem) => (
                  <div key={classItem.id} className="mb-4 last:mb-0">
                    <h4 className="text-indigo-600 font-semibold">
                      {classItem.title}
                    </h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        {format(new Date(classItem.start), 'h:mm a')}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <User className="w-4 h-4 mr-2" />
                        {classItem.instructor}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        {classItem.room}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleBooking(classItem.id)}
                      className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200 text-sm"
                    >
                      Book Now
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm py-2">No classes scheduled</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSchedule;
