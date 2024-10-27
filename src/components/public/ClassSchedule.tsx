import React, { useState } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addWeeks,
  subWeeks,
} from 'date-fns';
import {
  Clock,
  User,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Class } from './PublicLayout';

interface ClassScheduleProps {
  classes: Class[];
}

interface BookingModalProps {
  classItem: Class;
  onClose: () => void;
}

const BookingModal = ({ classItem, onClose }: BookingModalProps): JSX.Element => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Book {classItem.title}</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>{format(classItem.start, 'h:mm a')} - {format(classItem.end, 'h:mm a')}</span>
          </div>
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            <span>{classItem.instructor}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{classItem.room}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ClassSchedule: React.FC<ClassScheduleProps> = ({ classes }) => {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
  });

  const classesByDay = weekDays.reduce((acc, day) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    acc[dayKey] = classes.filter((c) => isSameDay(new Date(c.start), day))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    return acc;
  }, {} as Record<string, Class[]>);

  const handleBookNow = (classItem: Class) => {
    setSelectedClass(classItem);
  };

  const goToPreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Class Schedule</h2>
        <div className="flex space-x-4">
          <button
            onClick={goToPreviousWeek}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNextWeek}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">
              {format(day, 'EEEE')}
              <br />
              <span className="text-sm text-gray-500">
                {format(day, 'MMM d')}
              </span>
            </h3>
            <div className="space-y-2">
              {classesByDay[format(day, 'yyyy-MM-dd')]?.map((classItem) => (
                <div
                  key={classItem.id}
                  className="bg-white shadow rounded p-3"
                >
                  <h4 className="font-medium">{classItem.title}</h4>
                  <p className="text-sm text-gray-500">
                    {format(classItem.start, 'h:mm a')}
                  </p>
                  <p className="text-sm text-gray-500">{classItem.instructor}</p>
                  <button
                    onClick={() => handleBookNow(classItem)}
                    className="mt-2 w-full bg-indigo-600 text-white py-1 px-3 rounded text-sm hover:bg-indigo-700"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedClass && (
        <BookingModal
          classItem={selectedClass}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </div>
  );
};

export default ClassSchedule;
