import React, { useEffect, useState } from 'react';
import { Booking, BookingStatus } from '../types';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

const HistoryPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('jamhuri_bookings');
    if (data) {
      setBookings(JSON.parse(data));
    }
  }, []);

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING: return 'text-yellow-500 bg-yellow-500/10';
      case BookingStatus.CONFIRMED: return 'text-green-500 bg-green-500/10';
      case BookingStatus.CANCELLED: return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
           <h2 className="text-xl font-bold text-white">My Trips</h2>
           <p className="text-gray-400 text-sm">Upcoming and past rides</p>
        </div>
        <div className="text-xs text-gray-500">
            {bookings.length} Total
        </div>
      </header>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-[#121212] rounded-xl border border-[#2A2A2A]">
            <p className="text-gray-500">No bookings yet.</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-[#121212] rounded-xl border border-[#2A2A2A] p-5 hover:border-[#FFD300] transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-mono mb-1">{booking.id}</span>
                    <span className="text-[#FFD300] font-bold text-sm uppercase tracking-wide">{booking.type}</span>
                </div>
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="space-y-4 relative">
                 {/* Timeline Line */}
                 <div className="absolute left-[7px] top-2 bottom-6 w-[1px] bg-[#333] z-0"></div>

                <div className="flex gap-3 relative z-10">
                   <div className="w-4 h-4 rounded-full bg-[#1E1E1E] border-2 border-gray-600 shrink-0 mt-0.5"></div>
                   <div>
                      <p className="text-xs text-gray-500 mb-0.5">Pickup</p>
                      <p className="text-sm text-white font-medium line-clamp-1">{booking.pickup.address}</p>
                   </div>
                </div>
                
                <div className="flex gap-3 relative z-10">
                   <div className="w-4 h-4 rounded-full bg-[#FFD300] shrink-0 mt-0.5"></div>
                   <div>
                      <p className="text-xs text-gray-500 mb-0.5">Drop-off</p>
                      <p className="text-sm text-white font-medium line-clamp-1">{booking.dropoff.address}</p>
                   </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#2A2A2A] flex justify-between items-center">
                 <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={14} />
                    <span className="text-xs">
                        {format(new Date(booking.scheduledTime || booking.createdAt), 'MMM dd, yyyy')}
                    </span>
                    <span className="text-gray-600">|</span>
                    <Clock size={14} />
                     <span className="text-xs">
                        {format(new Date(booking.scheduledTime || booking.createdAt), 'HH:mm')}
                    </span>
                 </div>
                 <div className="text-white font-bold">
                    KES {booking.estimate.fare.toLocaleString()}
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;