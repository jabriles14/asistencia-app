import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ onBack }) => {
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [records, setRecords] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [groups, setGroups] = useState([]);
  const [dailySummary, setDailySummary] = useState({ present: 0, sick: 0, psg: 0, absent: 0, unjustified: 0, exit: 0 });
  const [lastFiveRecords, setLastFiveRecords] = useState([]);
  const [unregisteredCollaborators, setUnregisteredCollaborators] = useState([]);
  const [groupCounts, setGroupCounts] = useState({});

  // Función para cargar y procesar todos los datos
  const loadData = () => {
    const storedRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    const storedCollaborators = JSON.parse(localStorage.getItem('employees') || '[]');
    const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    setRecords(storedRecords);
    setCollaborators(storedCollaborators);
    setGroups(storedGroups);

    const today = dateFilter; // Usar la fecha del filtro para el resumen diario
    const todayRecords = storedRecords.filter(r => r.date === today);
    
    const presentCount = todayRecords.filter(r => r.status === 'present').length;
    const sickCount = todayRecords.filter(r => r.status === 'sick').length;
    const psgCount = todayRecords.filter(r => r.status === 'psg').length;
    const absentCount = todayRecords.filter(r => r.status === 'absent').length;
    const exitCount = todayRecords.filter(r => r.status === 'exit').length;

    // Colaboradores que SÍ registraron entrada hoy (para la fecha del filtro)
    const registeredEmailsToday = new Set(todayRecords.filter(r => r.type === 'entry').map(r => r.email));
    
    // Colaboradores que NO registraron entrada hoy (para la fecha del filtro)
    const currentlyUnregistered = storedCollaborators.filter(collab => !registeredEmailsToday.has(collab.email));
    setUnregisteredCollaborators(currentlyUnregistered);

    const unjustifiedAbsenceCount = currentlyUnregistered.length;

    setDailySummary({
      present: presentCount,
      sick: sickCount,
      psg: psgCount,
      absent: absentCount,
      unjustified: unjustifiedAbsenceCount,
      exit: exitCount
    });

    // Obtener los últimos 5 registros (sin importar la fecha)
    const sortedRecords = [...storedRecords].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setLastFiveRecords(sortedRecords.slice(0, 5));

    // Calcular resumen de colaboradores por grupo
    const counts = storedCollaborators.reduce((acc, collab) => {
      const groupName = collab.group || 'Sin Grupo Asignado';
      acc[groupName] = (acc[groupName] || 0) + 1;
      return acc;
    }, {});
    setGroupCounts(counts);
  };

  // Cargar datos al montar el componente y cuando cambie la fecha del filtro
  useEffect(() => {
    loadData();
  }, [dateFilter]);

  const filteredRecords = records
    .filter(record => record.date === dateFilter)
    .filter(record => statusFilter === 'all' || record.status === statusFilter)
    .filter(record => groupFilter === 'all' || record.group === groupFilter)
    .map(record => {
      const collaborator = collaborators.find(collab => collab.email === record.email);
      return {
        ...record,
        collaboratorInfo: collaborator || { fullName: 'Desconocido', email: record.email }
      };
    });

  const getStatusText = (status) => {
    switch (status) {
      case 'present': return 'Presente';
      case 'sick': return 'Falta por salud';
      case 'psg': return 'Permiso sin goce';
      case 'absent': return 'Falta injustificada';
      case 'exit': return 'Salida';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'sick': return 'bg-yellow-100 text-yellow-800';
      case 'psg': return 'bg-blue-100 text-blue-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'exit': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Dashboard de Asistencia</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
          <h3 className="text-gray-600 text-sm font-medium">Presentes</h3>
          <p className="text-3xl font-bold text-green-700">{dailySummary.present}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
          <h3 className="text-gray-600 text-sm font-medium">Faltas por salud</h3>
          <p className="text-3xl font-bold text-yellow-700">{dailySummary.sick}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
          <h3 className="text-gray-600 text-sm font-medium">PSG</h3>
          <p className="text-3xl font-bold text-blue-700">{dailySummary.psg}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
          <h3 className="text-gray-600 text-sm font-medium">Faltas Registradas</h3>
          <p className="text-3xl font-bold text-red-700">{dailySummary.absent}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
          <h3 className="text-gray-600 text-sm font-medium">Faltas Injustificadas</h3>
          <p className="text-3xl font-bold text-purple-700">{dailySummary.unjustified}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
          <h3 className="text-gray-600 text-sm font-medium">Salidas</h3>
          <p className="text-3xl font-bold text-purple-700">{dailySummary.exit}</p>
        </div>
      </div>

      {/* Sección de Resumen por Grupos */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Resumen de Colaboradores por Grupo</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad de Colaboradores</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(groupCounts).length > 0 ? (
                Object.entries(groupCounts).map(([groupName, count]) => (
                  <tr key={groupName}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{groupName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                    No hay colaboradores asignados a grupos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Registros del día</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="all">Todos los estados</option>
              <option value="present">Presentes</option>
              <option value="sick">Salud</option>
              <option value="psg">PSG</option>
              <option value="absent">Faltas Registradas</option>
              <option value="exit">Salidas</option>
            </select>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="all">Todos los grupos</option>
              {groups.map(group => (
                <option key={group.id} value={group.name}>{group.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={loadData} // Botón para actualizar datos
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
          >
            Actualizar Datos
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo/Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.collaboratorInfo.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.group || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.type === 'exit' ? record.reason : record.type === 'entry' ? record.status : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No hay registros para esta fecha o filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección: Colaboradores No Registrados Hoy */}
      <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Colaboradores No Registrados Hoy ({new Date().toLocaleDateString()})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {unregisteredCollaborators.length > 0 ? (
                unregisteredCollaborators.map((collaborator, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {collaborator.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {collaborator.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor('absent')}`}>
                        Falta Injustificada
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    ¡Todos los colaboradores han registrado su asistencia hoy! 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección de Últimos 5 Ingresos */}
      <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Últimos 5 Registros de Asistencia</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo/Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lastFiveRecords.length > 0 ? (
                lastFiveRecords.map((record, index) => {
                  const collaborator = collaborators.find(collab => collab.email === record.email);
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {collaborator?.fullName || 'Desconocido'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.group || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {getStatusText(record.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.type === 'exit' ? record.reason : record.type === 'entry' ? record.status : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No hay registros recientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;