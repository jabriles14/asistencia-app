import React, { useState, useEffect } from 'react';
import { initialEmployees } from '../../mock/employees'; // Importar la lista inicial

const EmployeeManagement = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    lastName: '',
    group: '',
    code: ''
  });
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const [importMessage, setImportMessage] = useState('');

  useEffect(() => {
    // Cargar colaboradores: si no hay en localStorage, usar la lista inicial
    const savedCollaborators = JSON.parse(localStorage.getItem('employees') || '[]');
    if (savedCollaborators.length === 0) {
      setCollaborators(initialEmployees);
      localStorage.setItem('employees', JSON.stringify(initialEmployees));
    } else {
      setCollaborators(savedCollaborators);
    }
    
    const savedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    setGroups(savedGroups);
  }, []); // Se ejecuta solo una vez al montar el componente

  // Este useEffect se encargará de actualizar la tabla cuando se modifiquen los colaboradores
  useEffect(() => {
    // Cada vez que 'collaborators' cambie (por agregar/eliminar/importar),
    // se guarda en localStorage y se actualiza la tabla.
    localStorage.setItem('employees', JSON.stringify(collaborators));
  }, [collaborators]); // Se ejecuta cada vez que 'collaborators' cambia

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCollaborator(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCollaborator = () => {
    setError('');
    if (!newCollaborator.name || !newCollaborator.lastName || !newCollaborator.group || !newCollaborator.code) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (collaborators.some(collab => collab.code === newCollaborator.code)) {
      setError('Este código ya está en uso.');
      return;
    }
    
    const updatedCollaborators = [...collaborators, {
      id: Date.now(),
      fullName: `${newCollaborator.name} ${newCollaborator.lastName}`,
      email: `${newCollaborator.code}@example.com`, // Generar email interno
      ...newCollaborator
    }];
    
    setCollaborators(updatedCollaborators); // Esto disparará el segundo useEffect
    setNewCollaborator({ name: '', lastName: '', group: '', code: '' });
  };

  const handleDeleteCollaborator = (id) => {
    const updatedCollaborators = collaborators.filter(collab => collab.id !== id);
    setCollaborators(updatedCollaborators); // Esto disparará el segundo useEffect
  };

  const handleImportCollaborators = (event) => {
    setImportMessage('');
    const file = event.target.files[0];
    if (!file) {
      setImportMessage('No se seleccionó ningún archivo.');
      return;
    }
    if (file.type !== 'text/csv') {
      setImportMessage('Por favor, sube un archivo CSV válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) {
          setImportMessage('El archivo CSV está vacío.');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim());
        const requiredHeaders = ['code', 'name', 'lastName', 'group'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          setImportMessage(`Faltan las siguientes columnas en el CSV: ${missingHeaders.join(', ')}`);
          return;
        }

        let addedCount = 0;
        let skippedCount = 0;
        const currentCodes = new Set(collaborators.map(c => c.code));
        const existingGroupNames = new Set(groups.map(g => g.name));

        const newCollaboratorsToAdd = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const collabData = {};
          headers.forEach((header, index) => {
            collabData[header] = values[index];
          });

          const { code, name, lastName, group } = collabData;
          const isValid = code && name && lastName && group;
          const isUniqueCode = !currentCodes.has(code);
          const groupExists = existingGroupNames.has(group);

          if (isValid && isUniqueCode && groupExists) {
            newCollaboratorsToAdd.push({
              id: Date.now() + Math.random(),
              fullName: `${name} ${lastName}`,
              email: `${code}@example.com`, // Generar email interno
              code,
              name,
              lastName,
              group
            });
            addedCount++;
          } else {
            skippedCount++;
          }
        }

        const updatedCollaborators = [...collaborators, ...newCollaboratorsToAdd];
        setCollaborators(updatedCollaborators); // Esto disparará el segundo useEffect
        setImportMessage(`Importación completada: ${addedCount} colaboradores agregados, ${skippedCount} omitidos (duplicados, datos incompletos o grupo inexistente).`);
      } catch (parseError) {
        setImportMessage('Error al procesar el archivo CSV. Asegúrate de que el formato sea correcto.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Gestión de Colaboradores</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
        <input
          type="text"
          name="code"
          value={newCollaborator.code}
          onChange={handleInputChange}
          placeholder="Código de acceso"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
      </div>
      
      {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

      <button
        onClick={handleAddCollaborator}
        className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 text-lg font-semibold shadow-md mb-6"
      >
        Agregar Colaborador
      </button>

      {/* Sección de Importación */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-inner">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Importar Colaboradores desde CSV</h3>
        <input
          type="file"
          accept=".csv"
          onChange={handleImportCollaborators}
          className="w-full text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {importMessage && <p className="mt-2 text-sm text-center">{importMessage}</p>}
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {collaborators.length > 0 ? (
              collaborators.map(collaborator => (
                <tr key={collaborator.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{collaborator.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{collaborator.group || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{collaborator.code}</td>
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
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
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


// DONE