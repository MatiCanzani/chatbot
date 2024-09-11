import { useEffect, useRef, useState, FormEvent, SetStateAction } from "react";
import { BiSave, BiEdit } from "react-icons/bi";
import { useAppContext } from "./AppContext";
export default function NameForm() {
  const { username, setUsername } = useAppContext();
  const [newUsername, setNewUsername] = useState(username);
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setNewUsername(username);
  }, [username]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toggleEditing();

    if (!newUsername) {
      setNewUsername(username);
      return;
    }

    setUsername(newUsername);
    localStorage.setItem("username", newUsername);
  };

  return (
    <form onSubmit={handleSubmit} className="mr-5">
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <input
            name="username"
            placeholder="Choose a username"
            onChange={(e) => setNewUsername(e.target.value)}
            value={newUsername}
            className="bg-gray-100 text-gray-900 border border-gray-300 rounded-sm p-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
            ref={inputRef}
            maxLength={15}
          />
        ) : (
          <span onClick={toggleEditing} className="cursor-pointer text-gray-900">
            Welcome <strong>{newUsername}</strong>
          </span>
        )}
        <button
          type="button"
          className="p-1 text-teal-500 hover:text-teal-600 focus:outline-none"
          onClick={(e) => {
            if (isEditing) {
              handleSubmit(e);
            } else toggleEditing();
          }}
        >
          {isEditing ? <BiSave className="text-xl" /> : <BiEdit className="text-xl" />}
        </button>
      </div>
    </form>
  );
}
