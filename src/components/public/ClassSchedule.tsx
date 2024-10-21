
import React from 'react';
import { config } from '../../config';

const ClassSchedule: React.FC = () => {
  const getClassStatus = (classItem: any) => {
    const bookedSpots = Math.floor(Math.random() * classItem.capacity);
    const remainingSpots = classItem.capacity - bookedSpots;
    if (remainingSpots === 0) {
      return { status: 'Fully Booked', color: 'bg-gray-500' };
    } else if (remainingSpots <= 5) {
      return { status: `${remainingSpots} spots left`, color: 'bg-yellow-500' };
    } else {
      return { status: 'Available', color: 'bg-green-500' };
    }
  };

  const filteredClasses = config.hasMultipleLocations && config.currentLocation
    ? config.classes.filter((c: any) => c.locationId === config.currentLocation.id)
    : config.classes;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Class Schedule</h2>
      {config.hasMultipleLocations && config.currentLocation && (
        <p className="text-lg mb-4">Showing classes for: {config.currentLocation.name}</p>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((classItem: any) => {
          const { status, color } = getClassStatus(classItem);
          return (
            <div key={classItem.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{classItem.name}</h3>
                <p className="text-gray-600 mb-2">Instructor: {classItem.instructor}</p>
                <p className="text-gray-600 mb-2">
                  {new Date(classItem.date).toLocaleDateString()} at {classItem.time}
                </p>
                <p className="text-gray-600 mb-4">Room: {classItem.room}</p>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${color} mb-4`}>
                  {status}
                </div>
                {classItem.description && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Class Description:</h4>
                    <p>{classItem.description}</p>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200">
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClassSchedule;
