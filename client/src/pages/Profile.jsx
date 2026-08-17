import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { backendURL, token, navigate } = useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(backendURL + '/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error('Failed to load profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

          {/* Top banner */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 h-28 relative">
            {/* Avatar */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{initials}</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="pt-14 pb-8 px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>

            {/* Divider */}
            <hr className="my-6 border-gray-100" />

            {/* Details */}
            <div className="text-left space-y-4">
              <div className="flex items-start gap-4 bg-gray-50 rounded-xl px-4 py-3">
                <div className="text-xl mt-0.5">👤</div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Full Name</p>
                  <p className="text-gray-800 font-medium mt-0.5">{user.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-gray-50 rounded-xl px-4 py-3">
                <div className="text-xl mt-0.5">✉️</div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Email Address</p>
                  <p className="text-gray-800 font-medium mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-gray-50 rounded-xl px-4 py-3">
                <div className="text-xl mt-0.5">🆔</div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Member ID</p>
                  <p className="text-gray-600 font-mono text-xs mt-0.5 break-all">{user.id}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate('/orders')}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                My Orders
              </button>
              <button
                onClick={() => navigate('/collection')}
                className="flex-1 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
