import React from 'react';

interface AlertProps {
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
  return (
    <div className=" bg-red-500 text-white p-4 rounded shadow-lg">
      <p>{message}</p>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-lg font-bold"
      >
        &times;
      </button>
    </div>
  );
};

export default Alert;
