import React, { useState, useEffect } from 'react';
import AuthScreen from './components/Auth/AuthScreen';
import EmployeeRegisterForm from './components/Employee/EmployeeRegisterForm';
import AdminPanel from './components/Admin/AdminPanel';
import { employees as initialEmployees } from './mock/employees'; // Importar la lista inicial de colaboradores

const App = () => {
  const [currentView, setCurrentView] = useState('auth');
  const [userData, setUserData] = useState(null);

  // useEffect para inicializar localStorage con datos mock si está vacío
  useEffect(() => {
    // Inicializar colaboradores
    const savedCollaborators = localStorage.getItem('employees');
    if (!savedCollaborators || JSON.parse(savedCollaborators).length === 0) {
      localStorage.setItem('employees', JSON.stringify(initialEmployees));
    }

    // Inicializar grupos
    const savedGroups = localStorage.getItem('groups');
    if (!savedGroups || JSON.parse(savedGroups).length === 0) {
      // Si no hay grupos guardados, inicializar con una lista vacía
      localStorage.setItem('groups', JSON.stringify([])); 
    }
  }, []); // Se ejecuta solo una vez al montar el componente App

  const handleLogin = (identifier, roleData) => { // identifier puede ser email (admin) o code (employee)
    setUserData({ identifier, ...roleData }); // Guardar el identificador
    setCurrentView(roleData.role === 'employee' ? 'employee' : 'admin');
  };

  const handleLogout = () => {
    setUserData(null);
    setCurrentView('auth');
  };

  const renderView = () => {
    switch(currentView) {
      case 'auth':
        return <AuthScreen onLogin={handleLogin} />;
      case 'employee':
        // Pasar el identificador (código) al EmployeeRegisterForm
        return <EmployeeRegisterForm collaboratorCode={userData.identifier} onBack={handleLogout} />;
      case 'admin':
        return <AdminPanel onBack={handleLogout} userData={userData} />;
      default:
        return <AuthScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      {currentView !== 'auth' && (
        <button 
          onClick={handleLogout}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      )}
      {renderView()}
    </div>
  );
};

export default App;