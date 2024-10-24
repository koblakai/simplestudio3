
import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Clock, User, MapPin, X } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

interface ClassItem {
  id: string;
  title: string;
  instructor: string;
  start: string;
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
      // Check if user has active membership
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

      // Add booking
      await addDoc(collection(db, 'bookings'), {
        classId: classItem.id,
        memberId: memberDoc.id,
        email,
        className: classItem.title,
        date: classItem.start,
        instructor: classItem.instructor,
        room: classItem.room,
        bookedAt: new Date().toISOString()
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
          <h3 className="text-lg font-semibold">Book Class: {classItem.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
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
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
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
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                      onClick={() => setSelectedClass(classItem)}
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
