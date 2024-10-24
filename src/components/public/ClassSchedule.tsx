import React, { useState } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { format } from 'date-fns';
import { Clock, User, MapPin } from 'lucide-react';

const ClassSchedule: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<ClassSchedule | null>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;

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
        classId: selectedClass.id,
        memberId: memberDoc.id,
        email,
        className: selectedClass.title,
        date: selectedClass.start,
        instructor: selectedClass.instructor,
        room: selectedClass.room,
        bookedAt: new Date().toISOString(),
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Class Schedule</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {classItem.title}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>
                    {format(new Date(classItem.start), 'h:mm a')} - 
                    {format(new Date(classItem.end), 'h:mm a')}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="w-5 h-5 mr-2" />
                  <span>{classItem.instructor}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{classItem.room}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedClass(classItem)}
                className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Book Class: {selectedClass.title}
            </h3>
            {!success ? (
              <form onSubmit={handleBooking}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>
                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setSelectedClass(null)}
                      className="flex-1 py-2 px-4 borderborder-gray-300 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md"
                    >
                      {isSubmitting ? 'Processing...' : 'Book Class'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div>
                <p className="text-green-600 mb-4">
                  Class booked successfully!
                </p>
                <button
                  onClick={() => setSelectedClass(null)}
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSchedule;