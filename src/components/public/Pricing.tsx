import React, { useState } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const membersRef = collection(db, 'members');
      const q = query(membersRef, where('email', '==', formData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const memberDoc = querySnapshot.docs[0];
        const memberData = memberDoc.data();
        
        if (new Date(memberData.expirationDate) > new Date()) {
          throw new Error('You already have an active membership.');
        }
      }

      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + selectedPlan.durationMonths);

      await addDoc(collection(db, 'members'), {
        ...formData,
        membershipType: selectedPlan.name,
        membershipPrice: selectedPlan.price,
        signUpDate: new Date().toISOString(),
        expirationDate: expirationDate.toISOString(),
        active: true,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Membership Plans
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your yoga journey
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pricing.map((plan) => (
            <div
              key={plan.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /month
                  </span>
                </p>
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className="mt-8 block w-full bg-indigo-600 border border-transparent rounded-md py-2 text-sm font-medium text-white text-center hover:bg-indigo-700"
                >
                  Get started
                </button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h4>
                <ul className="mt-6 space-y-4">
                  {plan.description.map((feature, index) => (
                    <li key={index} className="flex space-x-3">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Sign up for {selectedPlan.name}</h3>
            {!success ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      onClick={() => setSelectedPlan(null)}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md"
                    >
                      {isSubmitting ? 'Processing...' : 'Sign Up'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div>
                <p className="text-green-600 mb-4">
                  Welcome to our studio! Your membership has been activated.
                </p>
                <button
                  onClick={() => setSelectedPlan(null)}
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

export default Pricing;