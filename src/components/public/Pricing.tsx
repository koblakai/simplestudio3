
import React, { useState } from 'react';
import { config, PricingPlan } from '../../config';
import { Check, X } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

interface SignupModalProps {
  plan: PricingPlan;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ plan, onClose }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!db) {
      setError('Unable to connect to the database. Please try again later.');
      setIsSubmitting(false);
      return;
    }

    try {
      const membersRef = collection(db, 'members');
      if (!membersRef) {
        throw new Error('Database collection not accessible');
      }

      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + (plan.durationMonths || 1));

      await addDoc(membersRef, {
        firstName,
        lastName,
        email,
        membershipType: plan.name,
        signUpDate: new Date().toISOString(),
        expirationDate: expirationDate.toISOString(),
        active: true,
        createdAt: new Date().toISOString(),
      }).catch(err => {
        console.error('Error adding document:', err);
        throw new Error('Failed to create membership. Please try again.');
      });

      setSuccess(true);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Sign up for {plan.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="mt-4">
                <p className="font-medium">Plan Details:</p>
                <p>{plan.name} - ${plan.price}/month</p>
                <p>{plan.durationMonths} month{plan.durationMonths > 1 ? 's' : ''}</p>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>
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
                  {isSubmitting ? 'Processing...' : 'Sign Up'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div>
            <p className="text-green-600 mb-4">Signup successful! Welcome to our studio.</p>
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

const Pricing: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

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
          {config.pricing.map((plan: PricingPlan, index: number) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {plan.name}
                </h3>
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
                  {plan.description.map((desc: string, descIndex: number) => (
                    <li key={descIndex} className="flex space-x-3">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <SignupModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
};

export default Pricing;
