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
  X,
} from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

interface ClassItem {
  id: string;
  name: string;          // Using name consistently instead of title
  instructor: string;
  start: string;
  end: string;
  room: string;
  capacity: number;
}

interface BookingModalProps {
  classItem: ClassItem;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ classItem, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const membersRef = collection(db, 'members');
      const q = query(membersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('No active membership found. Please purchase a membership first.');
      }

      const memberDoc = querySnapshot.docs[0];
      const memberData = memberDoc.data();

      if (new Date(memberData.expirationDate) < new Date()) {
        throw new Error('Your membership has expired. Please renew your membership.');
      }

      await addDoc(collection(db, 'bookings'), {
        classId: classItem.id,
        memberId: memberDoc.id,
        email,
        className: classItem.name,  // Changed from title to name
        date: classItem.start,
        instructor: classItem.instructor,
        room: classItem.room,
        bookedAt: new Date().toISOString(),
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to book class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Book Class: {classItem.name} 
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-4 text-sm text-gray-600">
              <p>Class Details:</p>
              <p>Date: {format(new Date(classItem.start), 'MM/dd/yyyy')}</p>
              <p>Time: {format(new Date(classItem.start), 'h:mm a')}</p>
              <p>Instructor: {classItem.instructor}</p>
              <p>Room: {classItem.room}</p>
            </div>

            {error && (
              <div className="mb-4 text-red-600 text-sm">{error}</div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {isSubmitting ? 'Booking...' : 'Book Class'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p className="text-green-600 mb-4">Class booked successfully!</p>
            <button
              onClick={onClose}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ClassSchedule: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [thisWeekClasses, setThisWeekClasses] = useState<{ [key: string]: ClassItem[] }>({});
  const [upcomingClasses, setUpcomingClasses] = useState<ClassItem[]>([]);
  const [showUpcomingClasses, setShowUpcomingClasses] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClasses = async () => {
  try {
    const classesRef = collection(db, 'classes');
    console.log('Fetching classes...');
    const snapshot = await getDocs(classesRef);
    console.log('Fetched docs:', snapshot.docs.length);
    
    const fetchedClasses: ClassItem[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      
      // Create a proper Date object by combining date and time
      const [year, month, day] = data.date.split('-');
      const [hours, minutes] = data.time.split(':');
      
      const startDate = new Date(year, month - 1, day, hours, minutes);
      
      // Create end date (assuming 1 hour duration - adjust as needed)
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1);

      return {
        id: doc.id,
        title: data.name,
        instructor: data.instructor,
        start: startDate,
        end: endDate,
        room: data.room,
        capacity: data.capacity,
        description: data.description,
        isRecurring: data.isRecurring || false
      };
    });
    
    console.log('Processed classes:', fetchedClasses);
    setClasses(fetchedClasses);
  } catch (error) {
    console.error('Error fetching classes:', error);
  } finally {
    setLoading(false);
  }
};

  
    console.log('Processed classes:', fetchedClasses);
    setClasses(fetchedClasses);
  } catch (error) {
    console.error('Error fetching classes:', error);
  } finally {
    setLoading(false);
  }
};

    fetchClasses();
  }, []);

  useEffect(() => {
    if (classes.length === 0) return;

    const updateClasses = () => {
      const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
      const weekDays = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
      const thirtyDaysFromNow = addDays(new Date(), 30);

      // Organize this week's classes by day
      const thisWeek: { [key: string]: ClassItem[] } = {};
      weekDays.forEach((day) => {
        const dayKey = format(day, 'yyyy-MM-dd');
        thisWeek[dayKey] = classes
          .filter((classItem) => isSameDay(new Date(classItem.start), day))
          .sort(
            (a, b) =>
              new Date(a.start).getTime() - new Date(b.start).getTime()
          );
      });

      // Get upcoming classes for the next 30 days
      const upcoming = classes
        .filter((classItem) => {
          const classStart = new Date(classItem.start);
          return (
            isAfter(classStart, weekEnd) &&
            isBefore(classStart, thirtyDaysFromNow)
          );
        })
        .sort(
          (a, b) =>
            new Date(a.start).getTime() - new Date(b.start).getTime()
        );

      setThisWeekClasses(thisWeek);
      setUpcomingClasses(upcoming);
    };

    updateClasses();
  }, [classes, currentWeekStart]);

  const handleBookNow = (classItem: ClassItem) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
        Class Schedule
      </h2>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousWeek}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-bold">
          {format(currentWeekStart, 'MMMM d')} -{' '}
          {format(
            endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
            'MMMM d, yyyy'
          )}
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
                    <div
                      key={classItem.id}
                      className="bg-white shadow-sm rounded-lg p-4"
                    >
                      <h5 className="font-semibold text-indigo-600">
                        {classItem.name}  // Changed from title to name
                      </h5>
                      <div className="text-sm space-y-1 mt-2">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {format(new Date(classItem.start), 'h:mm a')} -{' '}
                          {format(new Date(classItem.end), 'h:mm a')}
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
                        onClick={() => handleBookNow(classItem)}
                        className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200 text-sm"
                      >
                        Book Now
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm py-2">
                    No classes scheduled
                  </p>
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
              <div
                key={classItem.id}
                className="bg-white shadow-sm rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold text-indigo-600">
                      {classItem.name}
                    </h5>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(classItem.start, 'EEEE, MMMM d')}
                    </p>
                    <div className="text-sm space-y-1 mt-2">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {format(classItem.start, 'h:mm a')} -{' '}
                        {format(classItem.end, 'h:mm a')}
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
                    onClick={() => handleBookNow(classItem)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
            {upcomingClasses.length === 0 && (
              <p className="text-center text-gray-500">
                No upcoming classes scheduled
              </p>
            )}
          </div>
        )}
      </div>

      {showBookingModal && selectedClass && (
        <BookingModal
          classItem={selectedClass}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedClass(null);
          }}
        />
      )}
    </div>
  );
};

export default ClassSchedule;