import React, { useContext, useState } from 'react';
import { AppContext } from '../layout/AppContext';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface UserFormProps {
  onSubmit: () => void; 
}


const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const { setUser } = useContext(AppContext)!;
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUser({ name, email });
    onSubmit();
  };

  const getClassName = (classes: string) => twMerge(clsx(classes));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nombre:</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={getClassName("mt-1 block w-full border border-gray-300 rounded p-2")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Correo Electrónico:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={getClassName("mt-1 block w-full border border-gray-300 rounded p-2")}
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Iniciar Trivia
      </button>
    </form>
  );
};

export default UserForm;
