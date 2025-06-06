import React, { useState, useEffect } from 'react';
import Logo from '../Logo';

const AuthScreen = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState(''); // Código de colaborador o correo de admin
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Nuevo useEffect para inicializar colaboradores si no existen
  useEffect(() => {
    const savedCollaborators = JSON.parse(localStorage.getItem('employees') || '[]');
    if (savedCollaborators.length === 0) {
      // Si no hay colaboradores en localStorage, inicializar con la lista del mock
      // Importar initialEmployees aquí para evitar circular dependency si se importa en App.js
      import('../../mock/employees').then(({ initialEmployees }) => {
        localStorage.setItem('employees', JSON.stringify(initialEmployees));
        // No es necesario setear el estado aquí, ya que el componente EmployeeManagement lo leerá
      });
    }
  }, []); // Se ejecuta solo una vez al montar el componente

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier) {
      setError('Por favor, ingresa tu código o correo electrónico.');
      return;
    }

    if (!role) {
      setError('Por favor, selecciona tu tipo de usuario.');
      return;
    }

    // Validación para administradores
    if (role === 'admin') {
      let adminRoleData = null;

      // Contraseñas fijas (para el administrador principal)
      if (password === 'abriles320580') {
        adminRoleData = {
          role: 'admin_full',
          canManageCollaborators: true,
          canManageGroups: true
        };
      } else if (password === 'calidadh2o') {
        adminRoleData = {
          role: 'admin_reports',
          canManageCollaborators: false,
          canManageGroups: false
        };
      } else {
        // Busca en la lista de administradores registrados dinámicamente
        const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
        const foundAdmin = adminUsers.find(user => user.email === identifier && user.password === password);
        if (foundAdmin) {
          adminRoleData = {
            role: foundAdmin.role,
            canManageCollaborators: foundAdmin.canManageCollaborators,
            canManageGroups: foundAdmin.canManageGroups
          };
        }
      }

      if (adminRoleData) {
        // Guarda la sesión del administrador en localStorage
        localStorage.setItem('currentAdminSession', JSON.stringify({ email: identifier, ...adminRoleData }));
        onLogin(identifier, adminRoleData);
      } else {
        setError('Credenciales de administrador incorrectas o no registrado.');
      }
      return;
    }

    // Validación para colaboradores (ahora solo por código)
    if (role === 'employee') {
      const collaborators = JSON.parse(localStorage.getItem('employees') || '[]');
      const foundCollaborator = collaborators.find(collab => collab.code === identifier); // Busca por código

      if (foundCollaborator) {
        // Si el código es válido, guarda el email interno del colaborador en localStorage
        // para que la aplicación lo reconozca en futuras sesiones.
        localStorage.setItem('currentCollaboratorEmail', foundCollaborator.email);
        onLogin(foundCollaborator.email, { role: 'employee' }); // Pasa el email interno del colaborador encontrado
      } else {
        setError('Código de colaborador no válido.');
      }
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Control de Asistencia</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="identifier" className="block text-gray-700 text-sm font-medium mb-2">
              {role === 'admin' ? 'Correo de Administrador' : 'Código de Colaborador'}
            </label>
            <input
              type={role === 'admin' ? 'email' : 'text'}
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder={role === 'admin' ? 'tu.correo@gmail.com' : 'Ingresa tu código'}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de usuario</label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => { setRole('employee'); setPassword(''); setIdentifier(''); }}
                className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${role === 'employee' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Colaborador
              </button>
              <button
                type="button"
                onClick={() => { setRole('admin'); setIdentifier(''); }}
                className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${role === 'admin' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Administrador
              </button>
            </div>
          </div>

          {role === 'admin' && (
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Contraseña de Administrador</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Ingresa la contraseña"
                required
              />
            </div>
          )}

          {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 text-lg font-semibold shadow-md"
          >
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;