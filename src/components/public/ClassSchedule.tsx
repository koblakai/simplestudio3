import React, { useState, useEffect } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addWeeks,
  subWeeks,
  addDays,
  isAfter,
  isBefore,
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

// Removed import of useSettings and BookingModal
// import { useSettings } from '../../contexts/SettingsContext';
// import BookingModal from './BookingModal';

// Define the Class interface
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

// Placeholder for BookingModal
const BookingModal: React.FC<{ classItem: Class; onClose: () => void }> = ({ classItem, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Booking for {classItem.title}</h3>
        {/* Booking form or details */}
        <button
          onClick={onClose}
          className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ClassSchedule: React.FC<{ classes: Class[] }> = ({ classes }) => {
  // Removed use of useSettings
  // const { settings } = useSettings();

  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showUpcomingClasses, setShowUpcomingClasses] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [thisWeekClasses, setThisWeekClasses] = useState<{ [key: string]: Class[] }>({});
  const [upcomingClasses, setUpcomingClasses] = useState<Class[]>([]);

  useEffect(() => {
    const updateClasses = () => {
      const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
      const weekDays = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
      const thirtyDaysFromNow = addDays(new Date(), 30);

      // Organize this week's classes by day
      const thisWeek: { [key: string]: Class[] } = {};
      weekDays.forEach((day) => {
        const dayKey = format(day, 'yyyy-MM-dd');
        thisWeek[dayKey] = classes
          .filter((c: Class) => {
            const classStart = new Date(c.start);
            return isSameDay(classStart, day);
          })
          .sort(
            (a: Class, b: Class) =>
              new Date(a.start).getTime() - new Date(b.start).getTime()
          );
      });

      // Get upcoming classes for the next 30 days
      const upcoming = classes
        .filter((c: Class) => {
          const classStart = new Date(c.start);
          return isAfter(classStart, weekEnd) && isBefore(classStart, thirtyDaysFromNow);
        })
        .sort(
          (a: Class, b: Class) =>
            new Date(a.start).getTime() - new Date(b.start).getTime()
        );

      setThisWeekClasses(thisWeek);
      setUpcomingClasses(upcoming);
    };

    updateClasses();
  }, [classes, currentWeekStart]);

  const handleBookNow = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowBookingModal(true);
  };

  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  };

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* ... Rest of your component code ... */}

      {/* Booking Modal */}
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

