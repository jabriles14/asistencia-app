import React, { useState, useEffect } from 'react';

const EmployeeRegisterForm = ({ userEmail, onBack }) => {
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groups, setGroups] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [recentRecords, setRecentRecords] = useState([]);
  const [collaboratorName, setCollaboratorName] = useState('Colaborador');
  const [hasRegisteredToday, setHasRegisteredToday] = useState(false); // Nuevo estado para saber si ya registró entrada
  const [exitReason, setExitReason] = useState(''); // Nuevo estado para el motivo de salida
  const [exitSubmitted, setExitSubmitted] = useState(false); // Nuevo estado para confirmar salida

  // Cargar grupos y registros recientes del colaborador y su nombre
  useEffect(() => {
    const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    setGroups(storedGroups);

    const allRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    const userSpecificRecords = allRecords.filter(record => record.email === userEmail);
    setRecentRecords(userSpecificRecords.slice(-3).reverse());

    const storedCollaborators = JSON.parse(localStorage.getItem('employees') || '[]');
    const currentCollaborator = storedCollaborators.find(collab => collab.email === userEmail);
    if (currentCollaborator) {
      setCollaboratorName(currentCollaborator.fullName);
    } else {
      setCollaboratorName(userEmail);
    }

    // Verificar si ya registró entrada hoy
    const today = new Date().toISOString().split('T')[0];
    const todayEntryRecord = userSpecificRecords.find(record => 
      record.date === today && record.type === 'entry'
    );
    setHasRegisteredToday(!!todayEntryRecord);

  }, [userEmail, submitted, exitSubmitted]); // Recargar cuando se envía un nuevo registro o salida

  const handleSubmitEntry = (e) => {
    e.preventDefault();
    if (!attendanceStatus) {
      alert('Por favor, selecciona un estado de asistencia.');
      return;
    }
    if (!selectedGroup) {
      alert('Por favor, selecciona tu grupo.');
      return;
    }
    
    const record = {
      email: userEmail,
      date: new Date().toISOString().split('T')[0],
      status: attendanceStatus,
      group: selectedGroup,
      timestamp: new Date().toISOString(),
      type: 'entry' // Tipo de registro: entrada
    };
    
    const allRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    allRecords.push(record);
    localStorage.setItem('attendanceRecords', JSON.stringify(allRecords));
    
    setSubmitted(true);
    setAttendanceStatus('');
    setSelectedGroup('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleSubmitExit = (e) => {
    e.preventDefault();
    if (!exitReason) {
      alert('Por favor, selecciona un motivo de salida.');
      return;
    }

    const record = {
      email: userEmail,
      date: new Date().toISOString().split('T')[0],
      status: 'exit', // Estado de salida
      reason: exitReason, // Motivo de salida
      timestamp: new Date().toISOString(),
      type: 'exit' // Tipo de registro: salida
    };

    const allRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    allRecords.push(record);
    localStorage.setItem('attendanceRecords', JSON.stringify(allRecords));

    setExitSubmitted(true);
    setExitReason('');
    setTimeout(() => setExitSubmitted(false), 3000);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present': return 'Presente';
      case 'sick': return 'Falta por salud';
      case 'psg': return 'Permiso sin goce';
      case 'absent': return 'Falta injustificada';
      case 'exit': return 'Salida'; // Nuevo estado
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-green-600';
      case 'sick': return 'text-yellow-600';
      case 'psg': return 'text-blue-600';
      case 'absent': return 'text-red-600';
      case 'exit': return 'text-purple-600'; // Nuevo color
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Registro de Asistencia</h2>
      <p className="text-gray-600 text-center mb-6">Bienvenido, <span className="font-semibold">{collaboratorName}</span></p>
      
      {submitted && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 text-center animate-fade-in">
          ¡Tu entrada ha sido registrada exitosamente!
        </div>
      )}
      {exitSubmitted && (
        <div className="bg-purple-100 text-purple-800 p-4 rounded-lg mb-6 text-center animate-fade-in">
          ¡Tu salida ha sido registrada exitosamente!
        </div>
      )}

      {!hasRegisteredToday ? (
        <form onSubmit={handleSubmitEntry} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Registro de Entrada</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="attendanceStatus" className="block text-gray-700 text-sm font-medium mb-2">Estado de asistencia</label>
              <select
                id="attendanceStatus"
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="present">Presente</option>
                <option value="sick">Falta por salud</option>
                <option value="psg">Permiso sin goce (PSG)</option>
                <option value="absent">Falta injustificada</option>
              </select>
            </div>

            <div>
              <label htmlFor="selectedGroup" className="block text-gray-700 text-sm font-medium mb-2">Selecciona tu Grupo</label>
              <select
                id="selectedGroup"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              >
                <option value="">Selecciona un grupo</option>
                {groups.map(group => (
                  <option key={group.id} value={group.name}>{group.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 text-lg font-semibold shadow-md"
            >
              Registrar Entrada
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmitExit} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Registro de Salida</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="exitReason" className="block text-gray-700 text-sm font-medium mb-2">Motivo de Salida</label>
              <select
                id="exitReason"
                value={exitReason}
                onChange={(e) => setExitReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              >
                <option value="">Selecciona un motivo</option>
                <option value="emergency">Emergencia</option>
                <option value="health">Salud</option>
                <option value="personal">Motivo Personal</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-3 px-4 rounded-lg hover:bg-purple-800 transition-colors duration-200 text-lg font-semibold shadow-md"
            >
              Registrar Salida
            </button>
          </div>
        </form>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Tus últimos registros</h3>
        {recentRecords.length > 0 ? (
          <ul className="space-y-3">
            {recentRecords.map((record, index) => (
              <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <span className="text-gray-700 font-medium">{new Date(record.date).toLocaleDateString()}</span>
                  <span className="block text-gray-500 text-sm">{new Date(record.timestamp).toLocaleTimeString()}</span>
                  {record.group && <span className="block text-gray-500 text-xs">Grupo: {record.group}</span>}
                  {record.type === 'exit' && record.reason && <span className="block text-gray-500 text-xs">Motivo: {record.reason}</span>}
                </div>
                <span className={`font-semibold ${getStatusColor(record.status)}`}>
                  {getStatusText(record.status)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No hay registros recientes.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeRegisterForm;