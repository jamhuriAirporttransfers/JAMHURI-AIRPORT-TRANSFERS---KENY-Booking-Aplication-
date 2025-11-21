import React, { useEffect, useState } from 'react';
import { Booking } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Button } from '../components/Button';

const AdminPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({ revenue: 0, trips: 0, pending: 0 });

  useEffect(() => {
    const data = localStorage.getItem('jamhuri_bookings');
    if (data) {
      const parsed: Booking[] = JSON.parse(data);
      setBookings(parsed);
      
      const revenue = parsed.reduce((acc, curr) => acc + curr.estimate.fare, 0);
      setStats({
        revenue,
        trips: parsed.length,
        pending: parsed.filter(b => b.status === 'Pending').length
      });
    }
  }, []);

  const chartData = [
    { name: 'Mon', trips: 4 },
    { name: 'Tue', trips: 3 },
    { name: 'Wed', trips: 8 },
    { name: 'Thu', trips: 6 },
    { name: 'Fri', trips: 12 },
    { name: 'Sat', trips: 15 },
    { name: 'Sun', trips: 10 },
  ];

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "ID,Name,Phone,Pickup,Dropoff,Fare,Status\n"
        + bookings.map(b => `${b.id},${b.userName},${b.userPhone},"${b.pickup.address}","${b.dropoff.address}",${b.estimate.fare},${b.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "jamhuri_bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-20">
       <header className="flex justify-between items-center">
           <div>
               <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
               <p className="text-gray-400 text-sm">Overview of operations</p>
            </div>
            <Button onClick={handleExport} variant="outline" className="w-auto px-4 py-2 text-xs">
                <Download size={16} /> Export
            </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#121212] p-5 rounded-xl border border-[#2A2A2A]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                        <DollarSign size={20} />
                    </div>
                    <span className="text-gray-400 text-sm font-medium">Total Revenue</span>
                </div>
                <p className="text-2xl font-bold text-white">KES {stats.revenue.toLocaleString()}</p>
            </div>
            
            <div className="bg-[#121212] p-5 rounded-xl border border-[#2A2A2A]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#FFD300]/10 rounded-lg text-[#FFD300]">
                        <TrendingUp size={20} />
                    </div>
                    <span className="text-gray-400 text-sm font-medium">Total Trips</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.trips}</p>
            </div>

            <div className="bg-[#121212] p-5 rounded-xl border border-[#2A2A2A]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                        <Users size={20} />
                    </div>
                    <span className="text-gray-400 text-sm font-medium">Pending Requests</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
            </div>
        </div>

        {/* Chart */}
        <div className="bg-[#121212] p-6 rounded-xl border border-[#2A2A2A]">
            <h4 className="text-sm font-bold text-white mb-6">Weekly Trip Volume</h4>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333', color: '#fff' }}
                            itemStyle={{ color: '#FFD300' }}
                        />
                        <Bar dataKey="trips" fill="#FFD300" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl overflow-hidden">
             <div className="p-4 border-b border-[#2A2A2A]">
                <h4 className="text-sm font-bold text-white">Recent Bookings</h4>
             </div>
             <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                     <thead className="text-xs text-gray-500 uppercase bg-[#1A1A1A]">
                         <tr>
                             <th className="px-6 py-3">ID</th>
                             <th className="px-6 py-3">Client</th>
                             <th className="px-6 py-3">Route</th>
                             <th className="px-6 py-3">Fare</th>
                             <th className="px-6 py-3">Status</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-[#2A2A2A]">
                         {bookings.slice(0, 5).map(booking => (
                             <tr key={booking.id} className="hover:bg-[#1E1E1E]">
                                 <td className="px-6 py-4 font-mono text-xs">{booking.id}</td>
                                 <td className="px-6 py-4">
                                     <div className="font-bold text-white">{booking.userName}</div>
                                     <div className="text-xs text-gray-500">{booking.userPhone}</div>
                                 </td>
                                 <td className="px-6 py-4 max-w-xs truncate">
                                     <span className="text-gray-400">From:</span> {booking.pickup.address.split(',')[0]} <br/>
                                     <span className="text-gray-400">To:</span> {booking.dropoff.address.split(',')[0]}
                                 </td>
                                 <td className="px-6 py-4 font-bold text-[#FFD300]">
                                     {booking.estimate.fare.toLocaleString()}
                                 </td>
                                 <td className="px-6 py-4">
                                     <span className="px-2 py-1 rounded-full text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                         {booking.status}
                                     </span>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
                 {bookings.length === 0 && (
                     <div className="p-8 text-center text-gray-500">No bookings found</div>
                 )}
             </div>
        </div>
    </div>
  );
};

export default AdminPage;