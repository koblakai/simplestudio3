
import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isAfter } from 'date-fns';
import { useSettings } from '../../contexts/SettingsContext';
import BookingModal from './BookingModal';

const ClassSchedule: React.FC = () => {
  const { settings } = useSettings();
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getClassesForDay = (day: Date) => {
    return settings.classes
      .filter((c: any) => {
        const classDate = new Date(c.start);
        return isSameDay(classDate, day) && isAfter(classDate, now);
      })
      .sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime());
  };

  const handleBookNow = (classItem: any) => {
    setSelectedClass(classItem);
    setShowBookingModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Class Schedule</h2>
      <h3 className="text-2xl font-bold mb-6">This Week's Classes</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-6">
        {weekDays.map((day) => {
          const dayClasses = getClassesForDay(day);
          return (
            <div key={day.toISOString()} className="flex-1 min-w-[200px]">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg">{format(day, 'EEEE')}</h3>
                <p className="text-gray-500">{format(day, 'MMM d')}</p>
              </div>
              
              {dayClasses.length > 0 ? (
                dayClasses.map((classItem: any) => (
                  <div key={classItem.id} className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <h3 className="text-lg font-semibold text-indigo-600">
                      {classItem.title}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {format(new Date(classItem.start), 'h:mm a')}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {classItem.instructor}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {classItem.room}
                      </div>
                    </div>
                    <button 
                      className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200"
                      onClick={() => handleBookNow(classItem)}
                    >
                      Book Now
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No classes scheduled</p>
              )}
            </div>
          );
        })}
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
    