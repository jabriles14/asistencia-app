import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import EmployeeManagement from './EmployeeManagement';
import GroupManagement from './GroupManagement';
import AdminUserManagement from './AdminUserManagement';

const AdminPanel = ({ onBack, userData }) => { // Recibe userData en lugar de adminRole
  const [activeTab, setActiveTab] = useState('dashboard'); // Estado para la pestaña activa

  // Determinar si el usuario actual tiene permisos de gestión
  const canManageCollaborators = userData.role === 'admin_full' || userData.canManageCollaborators;
  const canManageGroups = userData.role === 'admin_full' || userData.canManageGroups;
  const canManageAdmins = userData.role === 'admin_full'; // Solo el super-admin puede gestionar otros admins

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg mt-10">
        {/* Navegación por pestañas */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            {canManageCollaborators && ( // Mostrar solo si tiene permiso
              <button
                onClick={() => setActiveTab('collaborators')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'collaborators'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Gestión de Colaboradores
              </button>
            )}
            {canManageGroups && ( // Mostrar solo si tiene permiso
              <button
                onClick={() => setActiveTab('groups')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'groups'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Gestión de Grupos
              </button>
            )}
            {canManageAdmins && ( // Mostrar solo si es super-admin
              <button
                onClick={() => setActiveTab('adminUsers')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'adminUsers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Gestión de Administradores
              </button>
            )}
          </nav>
        </div>

        {/* Contenido de las pestañas */}
        <div className="p-6">
          {activeTab === 'dashboard' && <AdminDashboard onBack={onBack} />}
          {activeTab === 'collaborators' && canManageCollaborators && <EmployeeManagement />}
          {activeTab === 'groups' && canManageGroups && <GroupManagement />}
          {activeTab === 'adminUsers' && canManageAdmins && <AdminUserManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;


// DONE