import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Calendar, Clock, Car, Info, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { calculateFareAndRoute, getPlacePredictions } from '../services/mapService';
import { sendBookingEmail } from '../services/emailService';
import { Booking, LocationData, RideEstimate, RideType, BookingStatus } from '../types';
import { format, addHours } from 'date-fns';

const BookingPage: React.FC = () => {
  // State
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  const [estimate, setEstimate] = useState<RideEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [activeField, setActiveField] = useState<'pickup' | 'dropoff' | null>(null);

  // Handlers
  const handleAddressChange = async (value: string, type: 'pickup' | 'dropoff') => {
    if (type === 'pickup') setPickup(value);
    else setDropoff(value);
    
    setActiveField(type);
    
    if (value.length > 2) {
      const preds = await getPlacePredictions(value);
      setSuggestions(preds);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (loc: LocationData) => {
    if (activeField === 'pickup') setPickup(loc.address);
    else setDropoff(loc.address);
    
    setSuggestions([]);
    setActiveField(null);
  };

  const handleCalculate = async () => {
    if (!pickup || !dropoff) return;
    setLoading(true);
    // Mock coordinates for the demo if real geocoding isn't available
    const mockPickup: LocationData = { address: pickup, lat: -1.2921, lng: 36.8219 };
    const mockDropoff: LocationData = { address: dropoff, lat: -1.3192, lng: 36.9275 };
    
    const est = await calculateFareAndRoute(mockPickup, mockDropoff);
    setEstimate(est);
    setLoading(false);
  };

  const handleBooking = async () => {
    if (!estimate) return;
    setLoading(true);

    const newBooking: Booking = {
      id: `TRIP-${Math.floor(Math.random() * 10000)}`,
      userId: 'USER-123',
      userName: 'John Doe',
      userPhone: '+254712345678',
      pickup: { address: pickup, lat: 0, lng: 0 },
      dropoff: { address: dropoff, lat: 0, lng: 0 },
      type: isScheduled ? RideType.SCHEDULED : RideType.INSTANT,
      scheduledTime: isScheduled ? `${scheduledDate}T${scheduledTime}` : new Date().toISOString(),
      estimate: estimate,
      status: BookingStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    // Save to local storage for History page
    const existingHistory = JSON.parse(localStorage.getItem('jamhuri_bookings') || '[]');
    localStorage.setItem('jamhuri_bookings', JSON.stringify([newBooking, ...existingHistory]));

    // Send Email
    await sendBookingEmail(newBooking);

    setLoading(false);
    setBookingSuccess(true);
  };

  const resetBooking = () => {
    setPickup('');
    setDropoff('');
    setEstimate(null);
    setBookingSuccess(false);
    setSuggestions([]);
  };

  if (bookingSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6 animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
        <p className="text-gray-400 mb-6 max-w-xs">
          Your ride request has been sent. The admin has been notified via email. 
          You will receive a confirmation call shortly.
        </p>
        <Button onClick={resetBooking} className="max-w-xs">Book Another Ride</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold text-white">Where to?</h2>
        <p className="text-gray-400 text-sm">Comfort rides across Kenya</p>
      </header>

      {/* Input Section */}
      <div className="bg-[#121212] p-5 rounded-xl border border-[#2A2A2A] relative space-y-4">
        {/* Ride Type Switcher */}
        <div className="flex bg-black p-1 rounded-lg border border-[#333] mb-2">
          <button 
            onClick={() => setIsScheduled(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${!isScheduled ? 'bg-[#FFD300] text-black' : 'text-gray-500'}`}
          >
            Ride Now
          </button>
          <button 
             onClick={() => setIsScheduled(true)}
             className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${isScheduled ? 'bg-[#FFD300] text-black' : 'text-gray-500'}`}
          >
            Schedule
          </button>
        </div>

        <div className="relative z-20">
            <Input 
            icon={<MapPin size={18} />} 
            placeholder="Enter pickup location" 
            value={pickup}
            onChange={(e) => handleAddressChange(e.target.value, 'pickup')}
            />
            {activeField === 'pickup' && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-[#1E1E1E] border border-[#333] rounded-lg mt-1 shadow-xl overflow-hidden">
                    {suggestions.map((s, i) => (
                        <div key={i} onClick={() => selectSuggestion(s)} className="p-3 hover:bg-[#333] cursor-pointer text-sm border-b border-[#2A2A2A] last:border-0">
                            {s.address}
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="relative z-10">
            <Input 
            icon={<Navigation size={18} />} 
            placeholder="Enter drop-off destination" 
            value={dropoff}
            onChange={(e) => handleAddressChange(e.target.value, 'dropoff')}
            />
             {activeField === 'dropoff' && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-[#1E1E1E] border border-[#333] rounded-lg mt-1 shadow-xl overflow-hidden">
                    {suggestions.map((s, i) => (
                        <div key={i} onClick={() => selectSuggestion(s)} className="p-3 hover:bg-[#333] cursor-pointer text-sm border-b border-[#2A2A2A] last:border-0">
                            {s.address}
                        </div>
                    ))}
                </div>
            )}
        </div>

        {isScheduled && (
          <div className="flex gap-4 animate-in slide-in-from-top-2">
            <Input 
              type="date" 
              icon={<Calendar size={18} />}
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <Input 
              type="time" 
              icon={<Clock size={18} />}
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>
        )}

        <Button onClick={handleCalculate} isLoading={loading} disabled={!pickup || !dropoff}>
          Calculate Estimate
        </Button>
      </div>

      {/* Estimate Card */}
      {estimate && (
        <div className="animate-in slide-in-from-bottom-5 fade-in duration-500">
           {/* Mock Map View */}
           <div className="h-40 w-full bg-[#1E1E1E] rounded-t-xl border border-[#2A2A2A] border-b-0 overflow-hidden relative group">
                {/* Normally we'd render a GoogleMap React component here. For now, a placeholder style. */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://picsum.photos/800/400?grayscale')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                    <span className="text-xs bg-black/70 px-2 py-1 rounded text-white backdrop-blur-md">Route Preview</span>
                </div>
           </div>

           <div className="bg-[#121212] p-6 rounded-b-xl border border-[#2A2A2A] space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#2A2A2A]">
                    <div className="space-y-1">
                        <div className="text-[#FFD300] font-bold text-lg flex items-center gap-2">
                            <Car size={20} />
                            Comfort Ride
                        </div>
                        <p className="text-xs text-gray-500">Toyota Crown, Fielder or similar</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-white">KES {estimate.fare.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Est. Price</div>
                    </div>
                </div>

                <div className="flex justify-between text-sm text-gray-300">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-gray-500 text-xs uppercase">Distance</span>
                        <span className="font-semibold">{estimate.distanceKm} km</span>
                    </div>
                    <div className="w-[1px] bg-[#2A2A2A]"></div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-gray-500 text-xs uppercase">Duration</span>
                        <span className="font-semibold">{estimate.durationMin} min</span>
                    </div>
                     <div className="w-[1px] bg-[#2A2A2A]"></div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-gray-500 text-xs uppercase">Arrival</span>
                        <span className="font-semibold">{format(addHours(new Date(), estimate.durationMin / 60), 'HH:mm')}</span>
                    </div>
                </div>

                <div className="bg-[#1A1A1A] p-3 rounded border border-[#333] flex gap-3 items-start">
                    <Info size={16} className="text-[#FFD300] shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400 leading-relaxed">
                        Price may vary slightly based on traffic. Admin will confirm the final details via phone/email shortly after booking.
                    </p>
                </div>

                <Button onClick={handleBooking} isLoading={loading}>
                   {isScheduled ? 'Confirm Reservation' : 'Request Ride Now'} <ChevronRight size={18} />
                </Button>
           </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;