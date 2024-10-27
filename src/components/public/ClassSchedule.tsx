import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, addDays, isAfter, isBefore } from 'date-fns';
import { Clock, User, MapPin, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import BookingModal from './BookingModal';

interface Class {
  id: string;
  title: string;
  instructor: string;
  start: Date;
  end: Date;
  capacity: number;
  room: string;
  description: string;
}

const ClassSchedule: React.FC = () => {
  const { settings } = useSettings();
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showUpcomingClasses, setShowUpcomingClasses] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [thisWeekClasses, setThisWeekClasses] = useState<{ [key: string]: Class[] }>({});
  const [upcomingClasses, setUpcomingClasses] = useState<Class[]>([]);

  useEffect(() => {
    const updateClasses = () => {
      const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
      const weekDays = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
      const thirtyDaysFromNow = addDays(new Date(), 30);

      // Organize this week's classes by day
      const thisWeek: { [key: string]: Class[] } = {};
      weekDays.forEach(day => {
        const dayKey = format(day, 'yyyy-MM-dd');
        thisWeek[dayKey] = settings.classes
          .filter(c => {
            const classStart = new Date(c.start);
            return isSameDay(classStart, day);
          })
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
      });

      // Get upcoming classes for the next 30 days
      const upcoming = settings.classes
        .filter(c => {
          const classStart = new Date(c.start);
          return isAfter(classStart, weekEnd) && 
                 isBefore(classStart, thirtyDaysFromNow);
        })
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

      setThisWeekClasses(thisWeek);
      setUpcomingClasses(upcoming);
    };

    updateClasses();
  }, [settings.classes, currentWeekStart]);

  const handleBookNow = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowBookingModal(true);
  };

  const goToPreviousWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 })
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Class Schedule</h2>
      
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousWeek}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-bold">
          {format(currentWeekStart, 'MMMM d')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMMM d, yyyy')}
        </h3>
        <button
          onClick={goToNextWeek}
          className="p-2 rounded-full hover:bg-gray-100"
        >
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
