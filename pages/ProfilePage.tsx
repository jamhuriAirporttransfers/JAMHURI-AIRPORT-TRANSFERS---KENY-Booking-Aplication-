import React from 'react';
import { User, Phone, Mail, MapPin, Heart, LogOut } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-6">
       <header>
           <h2 className="text-xl font-bold text-white">Profile</h2>
           <p className="text-gray-400 text-sm">Manage your account details</p>
        </header>

        <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-[#1E1E1E] border-2 border-[#FFD300] flex items-center justify-center text-[#FFD300]">
                <User size={40} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white">John Doe</h3>
                <p className="text-gray-500 text-sm">+254 712 345 678</p>
            </div>
        </div>

        <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Personal Info</h4>
            <Input icon={<User size={18} />} defaultValue="John Doe" label="Full Name" />
            <Input icon={<Phone size={18} />} defaultValue="+254 712 345 678" label="Phone Number" />
            <Input icon={<Mail size={18} />} defaultValue="john.doe@example.com" label="Email Address" />
            <div className="pt-4">
                <Button variant="outline">Update Profile</Button>
            </div>
        </div>

        <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl overflow-hidden">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest p-6 pb-2">Saved Places</h4>
            <div className="divide-y divide-[#2A2A2A]">
                <div className="p-4 flex items-center gap-4 hover:bg-[#1E1E1E] cursor-pointer transition-colors">
                    <div className="p-2 bg-[#1E1E1E] rounded-full text-[#FFD300]">
                        <Heart size={18} fill="#FFD300" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-bold">Home</p>
                        <p className="text-gray-500 text-xs">Kileleshwa, Nairobi</p>
                    </div>
                </div>
                <div className="p-4 flex items-center gap-4 hover:bg-[#1E1E1E] cursor-pointer transition-colors">
                    <div className="p-2 bg-[#1E1E1E] rounded-full text-gray-400">
                        <MapPin size={18} />
                    </div>
                    <div>
                        <p className="text-white text-sm font-bold">Work</p>
                        <p className="text-gray-500 text-xs">Westlands Office Park</p>
                    </div>
                </div>
            </div>
        </div>

        <Button variant="danger" className="mt-8">
            <LogOut size={18} /> Log Out
        </Button>
    </div>
  );
};

export default ProfilePage;