import React, { useState, useEffect } from 'react';
import AuthScreen from './components/Auth/AuthScreen';
import EmployeeRegisterForm from './components/Employee/EmployeeRegisterForm';
import AdminPanel from './components/Admin/AdminPanel';
import { initialEmployees } from './mock/employees'; // Importar la lista inicial de empleados

const App = () => {
  const [currentView, setCurrentView] = useState('auth');
  const [userData, setUserData] = useState(null); // userData ahora incluye el rol específico (admin_full, admin_reports)

  // useEffect para inicializar colaboradores y grupos en localStorage si no existen
  // y para cargar la sesión de administrador o colaborador si existe
  useEffect(() => {
    // Inicializar colaboradores
    const savedCollaborators = JSON.parse(localStorage.getItem('employees') || '[]');
    if (savedCollaborators.length === 0) {
      localStorage.setItem('employees', JSON.stringify(initialEmployees));
    }

    // Inicializar grupos (opcional, si quieres grupos por defecto)
    const savedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    if (savedGroups.length === 0) {
      // Puedes definir algunos grupos iniciales aquí si quieres
      const defaultGroups = [
        { id: 1, name: "Soto" },
        { id: 2, name: "Arturo" },
        { id: 3, name: "Crm" },
        { id: 4, name: "Salinas" }
      ];
      localStorage.setItem('groups', JSON.stringify(defaultGroups));
    }

    // Verificar si hay una sesión de administrador guardada
    const storedAdminSession = localStorage.getItem('currentAdminSession');
    if (storedAdminSession) {
      const adminData = JSON.parse(storedAdminSession);
      setUserData(adminData);
      setCurrentView('admin');
      return; // Si hay sesión de admin, no verificar colaborador
    }

    // Verificar si hay un colaborador logueado en localStorage
    const storedCollaboratorEmail = localStorage.getItem('currentCollaboratorEmail');
    if (storedCollaboratorEmail) {
      // Si hay un email guardado, asume que es un colaborador y lo loguea automáticamente
      setUserData({ email: storedCollaboratorEmail, role: 'employee' });
      setCurrentView('employee');
    }
  }, []); // Se ejecuta solo una vez al cargar la aplicación

  const handleLogin = (email, roleData) => { // roleData ahora es el objeto de permisos
    setUserData({ email, ...roleData }); // Desestructurar roleData para obtener role y permisos
    setCurrentView(roleData.role === 'employee' ? 'employee' : 'admin');
  };

  const handleLogout = () => {
    setUserData(null);
    setCurrentView('auth');
    localStorage.removeItem('currentCollaboratorEmail'); // Limpiar el email del colaborador al cerrar sesión
    localStorage.removeItem('currentAdminSession'); // Limpiar la sesión del administrador al cerrar sesión
  };

  const renderView = () => {
    switch(currentView) {
      case 'auth':
        return <AuthScreen onLogin={handleLogin} />;
      case 'employee':
        return <EmployeeRegisterForm userEmail={userData.email} onBack={handleLogout} />;
      case 'admin':
        // Pasar el objeto userData completo al AdminPanel
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


// DONE