import React, { useState, useEffect } from 'react';

const AdminUserManagement = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    role: 'admin_reports',
    canManageCollaborators: false,
    canManageGroups: false
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const savedAdminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    setAdminUsers(savedAdminUsers);
  }, []);

  useEffect(() => {
    localStorage.setItem('adminUsers', JSON.stringify(adminUsers));
  }, [adminUsers]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAdmin(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAdmin = () => {
    setError('');
    if (!newAdmin.email || !newAdmin.password || !newAdmin.role) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (!newAdmin.email.endsWith('@gmail.com')) {
      setError('El correo debe ser de Gmail.');
      return;
    }
    if (adminUsers.some(user => user.email === newAdmin.email)) {
      setError('Este correo ya está registrado como administrador.');
      return;
    }

    const updatedAdminUsers = [...adminUsers, { id: Date.now(), ...newAdmin }];
    setAdminUsers(updatedAdminUsers);
    setNewAdmin({
      email: '',
      password: '',
      role: 'admin_reports',
      canManageCollaborators: false,
      canManageGroups: false
    });
  };

  const handleDeleteAdmin = (id) => {
    const updatedAdminUsers = adminUsers.filter(user => user.id !== id);
    setAdminUsers(updatedAdminUsers);
  };

  // Función para exportar datos
  const exportData = (data, filename) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCollaborators = () => {
    const data = JSON.parse(localStorage.getItem('employees') || '[]');
    exportData(data, 'colaboradores.json');
  };

  const handleExportAttendance = () => {
    const data = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    exportData(data, 'registros_asistencia.json');
  };

  const handleExportGroups = () => {
    const data = JSON.parse(localStorage.getItem('groups') || '[]');
    exportData(data, 'grupos.json');
  };

  const handleExportAdminUsers = () => {
    const data = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    exportData(data, 'usuarios_administradores.json');
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Gestión de Usuarios Administradores</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="email"
          name="email"
          value={newAdmin.email}
          onChange={handleInputChange}
          placeholder="Correo del administrador (Gmail)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <input
          type="password"
          name="password"
          value={newAdmin.password}
          onChange={handleInputChange}
          placeholder="Contraseña"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <select
          name="role"
          value={newAdmin.role}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="admin_reports">Administrador de Reportes</option>
          <option value="admin_full">Administrador Completo</option>
        </select>
      </div>

      {/* Checkboxes de permisos */}
      <div className="mb-4 flex flex-col md:flex-row md:justify-center gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="canManageCollaborators"
            checked={newAdmin.canManageCollaborators}
            onChange={handleInputChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">Gestionar Colaboradores</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="canManageGroups"
            checked={newAdmin.canManageGroups}
            onChange={handleInputChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">Gestionar Grupos</span>
        </label>
      </div>
      
      {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

      <button
        onClick={handleAddAdmin}
        className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 text-lg font-semibold shadow-md mb-6"
      >
        Agregar Administrador
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colaboradores</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {adminUsers.length > 0 ? (
              adminUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role === 'admin_full' ? 'Completo' : 'Reportes'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.canManageCollaborators ? '✅' : '❌'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.canManageGroups ? '✅' : '❌'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteAdmin(user.id)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No hay usuarios administradores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sección de Exportar Datos */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-inner">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Exportar Datos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExportCollaborators}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md"
          >
            Exportar Colaboradores (.json)
          </button>
          <button
            onClick={handleExportAttendance}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md"
          >
            Exportar Registros de Asistencia (.json)
          </button>
          <button
            onClick={handleExportGroups}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md"
          >
            Exportar Grupos (.json)
          </button>
          <button
            onClick={handleExportAdminUsers}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md"
          >
            Exportar Usuarios Administradores (.json)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;