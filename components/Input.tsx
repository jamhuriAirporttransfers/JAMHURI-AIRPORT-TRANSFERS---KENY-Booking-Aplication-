import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-gray-400 text-xs font-semibold mb-1.5 uppercase tracking-wider">{label}</label>}
      <div className="relative">
        <input
          className={`w-full bg-[#1E1E1E] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#FFD300] focus:ring-1 focus:ring-[#FFD300] transition-colors placeholder-gray-600 ${icon ? 'pl-11' : ''} ${className}`}
          {...props}
        />
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};