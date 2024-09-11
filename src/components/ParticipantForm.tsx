import React, { useState } from 'react';

interface ParticipantFormProps {
  onSubmit: (email: string, invoiceNumber: string) => void;
}

const ParticipantForm: React.FC<ParticipantFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, invoiceNumber);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center w-full space-x-2">
      <div>
        <label className="block text-sm font-medium">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Número de Factura:</label>
        <input
          type="text"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Validar Participación
      </button>
    </form>
  );
};

export default ParticipantForm;
