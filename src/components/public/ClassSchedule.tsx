
import React from 'react';
import { config } from '../../config';

const ClassSchedule: React.FC = () => {
  // Mock class data (replace with actual data in production)
  const classes = [
    { id: 1, name: 'Vinyasa Flow', instructor: 'Jane Doe', date: '2024-03-15', time: '09:00', capacity: 20, booked: 15 },
    { id: 2, name: 'Hatha Yoga', instructor: 'John Smith', date: '2024-03-15', time: '11:00', capacity: 15, booked: 10 },
    { id: 3, name: 'Yin Yoga', instructor: 'Emily Brown', date: '2024-03-15', time: '14:00', capacity: 25, booked: 20 },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Class Schedule</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <div key={classItem.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{classItem.name}</h3>
              <p className="text-gray-600 mb-2">Instructor: {classItem.instructor}</p>
              <p className="text-gray-600 mb-2">
                {new Date(classItem.date).toLocaleDateString()} at {classItem.time}
              </p>
              <p className="text-gray-600 mb-4">
                {classItem.booked} / {classItem.capacity} spots filled
              </p>
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSchedule;
