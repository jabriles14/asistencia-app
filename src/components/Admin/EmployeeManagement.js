import React, { useState, useEffect } from 'react';

const EmployeeManagement = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    lastName: '',
    email: '',
    group: '' // Nuevo campo para el grupo del colaborador
  });
  const [groups, setGroups] = useState([]); // Para cargar los grupos disponibles
  const [error, setError] = useState('');

  // Cargar colaboradores y grupos al iniciar
  useEffect(() => {
    const savedCollaborators = JSON.parse(localStorage.getItem('employees') || '[]');
    setCollaborators(savedCollaborators);
    const savedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    setGroups(savedGroups);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCollaborator(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCollaborator = () => {
    setError('');
    if (!newCollaborator.name || !newCollaborator.lastName || !newCollaborator.email || !newCollaborator.group) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (!newCollaborator.email.endsWith('@gmail.com')) {
      setError('El correo debe ser de Gmail.');
      return;
    }
    if (collaborators.some(collab => collab.email === newCollaborator.email)) {
      setError('Este correo ya está registrado.');
      return;
    }
    
    const updatedCollaborators = [...collaborators, {
      id: Date.now(),
      ...newCollaborator,
      fullName: `${newCollaborator.name} ${newCollaborator.lastName}`
    }];
    
    setCollaborators(updatedCollaborators);
    localStorage.setItem('employees', JSON.stringify(updatedCollaborators));
    setNewCollaborator({ name: '', lastName: '', email: '', group: '' }); // Limpiar formulario
  };

  const handleDeleteCollaborator = (id) => {
    const updatedCollaborators = collaborators.filter(collab => collab.id !== id);
    setCollaborators(updatedCollaborators);
    localStorage.setItem('employees', JSON.stringify(updatedCollaborators));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Gestión de Colaboradores</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"> {/* Ajustado a 4 columnas */}
        <input
          type="text"
          name="name"
          value={newCollaborator.name}
          onChange={handleInputChange}
          placeholder="Nombre"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <input
          type="text"
          name="lastName"
          value={newCollaborator.lastName}
          onChange={handleInputChange}
          placeholder="Apellido"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <input
          type="email"
          name="email"
          value={newCollaborator.email}
          onChange={handleInputChange}
          placeholder="Correo electrónico (Gmail)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <select
          name="group"
          value={newCollaborator.group}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        >
          <option value="">Selecciona un grupo</option>
          {groups.map(group => (
            <option key={group.id} value={group.name}>{group.name}</option>
          ))}
        </select>
      </div>
      
      {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

      <button
        onClick={handleAddCollaborator}
        className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 text-lg font-semibold shadow-md mb-6"
      >
        Agregar Colaborador
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th> {/* Nueva columna */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {collaborators.length > 0 ? (
              collaborators.map(collaborator => (
                <tr key={collaborator.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{collaborator.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{collaborator.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{collaborator.group || 'N/A'}</td> {/* Mostrar grupo */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteCollaborator(collaborator.id)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500"> {/* Ajustado colSpan */}
                  No hay colaboradores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeManagement;