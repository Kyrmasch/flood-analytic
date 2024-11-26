import React from "react";

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick: () => void;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type = 'button', onClick, style, children }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <button type={type || 'button'} onClick={onClick}
        className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        style={{ whiteSpace: "nowrap", marginRight: "20px", ...style }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: "8px" }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <path d="M14 3v5h5M12 18v-6M9 15h6"/>
        </svg>
        {children}
      </button>
    </div>
  );
};

export default Button;
