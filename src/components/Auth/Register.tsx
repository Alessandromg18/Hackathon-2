import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterProps {
  onToggleForm: () => void;
}

export const Register = ({ onToggleForm }: RegisterProps) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData.email, formData.password);
    } catch (error: any) {
      if (error.response?.data?.message === 'El usuario ya existe') {
        setError('Este correo electrónico ya está registrado. ¿Ya tienes cuenta?');
      } else {
        setError('Error al registrar. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8">
        <div className="mt-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 mb-4 p-4 rounded-lg border border-red-500 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Crear Cuenta
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <button 
            onClick={onToggleForm} 
            className="inline-flex items-center px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-150"
          >
            ¿Ya tienes cuenta? Inicia sesión aquí
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
