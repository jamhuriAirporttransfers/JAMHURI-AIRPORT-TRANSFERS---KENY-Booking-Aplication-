import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "w-full py-3.5 px-6 rounded-lg font-bold text-sm transition-all duration-200 flex justify-center items-center gap-2";
  
  const variants = {
    primary: "bg-[#FFD300] text-black hover:bg-[#E5BD00] active:scale-[0.98] shadow-[0_0_15px_rgba(255,211,0,0.3)]",
    secondary: "bg-brand-gray text-white hover:bg-[#2A2A2A] active:scale-[0.98]",
    outline: "border-2 border-[#FFD300] text-[#FFD300] hover:bg-[#FFD300] hover:text-black",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} ${isLoading || props.disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
      ) : children}
    </button>
  );
};