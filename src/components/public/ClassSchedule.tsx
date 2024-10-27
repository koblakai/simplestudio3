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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Import classes data from settings
import classesData from '../../data/classes.json';

interface Class {
  id: string;
  title: string;
  instructor: string;
  start: string;
  end: string;
  capacity: number;
  room: string;
  description: string;
}

const BookingModal = ({ classItem, onClose }: { classItem: Class; onClose: () => void }): JSX.Element => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Book {classItem.title}</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>
              {format(new Date(classItem.start), 'h:mm a')} - {format(new Date(classItem.end), 'h:mm a')}
            </span>
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

const ClassSchedule: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showUpcomingClasses, setShowUpcomingClasses] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
  });

  const classes = classesData.classes;
  const thisWeekClasses = weekDays.reduce((acc, day) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    acc[dayKey] = classes
      .filter((c) => isSameDay(new Date(c.start), day))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    return acc;
  }, {} as Record<string, Class[]>);

  const upcomingClasses = classes
    .filter((c) => {
      const classStart = new Date(c.start);
      const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
      return classStart > weekEnd && classStart <= new Date(weekEnd.getTime() + 30 * 24 * 60 * 60 * 1000);
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const handleBookNow = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowBookingModal(true);
  };

  const goToPreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Class Schedule</h2>

      <div className="flex items-center justify-between mb-6">
        <button onClick={goToPreviousWeek} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-bold">
          {format(currentWeekStart, 'MMMM d')} -{' '}
          {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMMM d, yyyy')}
        </h3>
        <button onClick={goToNextWeek} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-8">
        {weekDays.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayClasses = thisWeekClasses[dayKey] || [];

          return (
            <div key={dayKey} className="flex flex-col">
              <div className="text-center mb-4">
                <div className="font-semibold text-lg">{format(day, 'EEEE')}</div>
                <div className="text-gray-500">{format(day, 'MMM d')}</div>
              </div>
              <div className="space-y-4 bg-white rounded-lg p-4 flex-grow">
                {dayClasses.length > 0 ? (
                  dayClasses.map((classItem) => (
                    <div key={classItem.id} className="bg-white shadow-sm rounded-lg p-4">
                      <h5 className="font-semibold text-indigo-600">{classItem.title}</h5>
                      <div className="text-sm space-y-1 mt-2">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {format(new Date(classItem.start), 'h:mm a')}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          {classItem.instructor}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {classItem.room}
                        </div>
                      </div>
                      <button
                        className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200"
                        onClick={() => handleBookNow(classItem)}
                      >
                        Book Now
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center">No classes scheduled</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12">
        <button
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
          onClick={() => setShowUpcomingClasses(!showUpcomingClasses)}
        >
          {showUpcomingClasses ? (
            <>
              <ChevronUp className="mr-2" size={20} />
              Hide upcoming classes
            </>
          ) : (
            <>
              <ChevronDown className="mr-2" size={20} />
              Show upcoming classes
            </>
          )}
        </button>

        {showUpcomingClasses && (
          <div className="space-y-4">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="bg-white shadow-sm rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold text-indigo-600">{classItem.title}</h5>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(classItem.start), 'EEEE, MMMM d')}
                    </p>
                    <div className="text-sm space-y-1 mt-2">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {format(new Date(classItem.start), 'h:mm a')}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        {classItem.instructor}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {classItem.room}
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200"
                    onClick={() => handleBookNow(classItem)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
            {upcomingClasses.length === 0 && (
              <p className="text-center text-gray-500">No upcoming classes scheduled</p>
            )}
          </div>
        )}
      </div>

      {showBookingModal && selectedClass && (
        <BookingModal
          classItem={selectedClass}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

export default ClassSchedule;
