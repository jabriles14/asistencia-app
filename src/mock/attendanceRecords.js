export const attendanceRecords = [
  { 
    employeeId: 1, 
    date: new Date().toISOString().split('T')[0], 
    status: "present",
    timestamp: new Date().toISOString(),
    type: "entry",
    email: "juan@gmail.com", // Mantener email para compatibilidad con registros existentes
    group: "Grupo A",
    code: "1001" // Añadir código al registro
  },
  { 
    employeeId: 2, 
    date: new Date().toISOString().split('T')[0], 
    status: "sick",
    timestamp: new Date().toISOString(),
    type: "entry",
    email: "maria@gmail.com",
    group: "Grupo B",
    code: "1002"
  },
  { 
    employeeId: 3, 
    date: new Date().toISOString().split('T')[0], 
    status: "psg",
    timestamp: new Date().toISOString(),
    type: "entry",
    email: "carlos@gmail.com",
    group: "Grupo A",
    code: "1003"
  },
  { 
    employeeId: 4, 
    date: new Date().toISOString().split('T')[0], 
    status: "absent",
    timestamp: new Date().toISOString(),
    type: "entry",
    email: "ana@gmail.com",
    group: "Grupo C",
    code: "1004"
  },
  { 
    employeeId: 1, 
    date: new Date().toISOString().split('T')[0], 
    status: "exit",
    reason: "personal",
    timestamp: new Date().toISOString(),
    type: "exit",
    email: "juan@gmail.com",
    group: "Grupo A",
    code: "1001"
  },
  // Registros de días anteriores para mostrar en el historial
  { 
    employeeId: 1, 
    date: "2023-11-14", 
    status: "present",
    timestamp: "2023-11-14T08:15:00",
    type: "entry",
    email: "juan@gmail.com",
    group: "Grupo A",
    code: "1001"
  },
  { 
    employeeId: 2, 
    date: "2023-11-14", 
    status: "present",
    timestamp: "2023-11-14T08:20:00",
    type: "entry",
    email: "maria@gmail.com",
    group: "Grupo B",
    code: "1002"
  }
];


Pasos para actualizar tu aplicación:

1.  Copia el código de `AuthScreen.js`: Copia todo el código del bloque `UPDATE FILE: /components/Auth/AuthScreen.js`.
2.  Abre el archivo `components/Auth/AuthScreen.js`: En tu proyecto local, abre este archivo.
3.  Reemplaza el contenido: Borra todo el contenido actual y pega el nuevo código.
4.  Guarda el archivo.
5.  Copia el código de `EmployeeRegisterForm.js`: Copia todo el código del bloque `UPDATE FILE: /components/Employee/EmployeeRegisterForm.js`.
6.  Abre el archivo `components/Employee/EmployeeRegisterForm.js`: En tu proyecto local, abre este archivo.
7.  Reemplaza el contenido: Borra todo el contenido actual y pega el nuevo código.
8.  Guarda el archivo.
9.  Copia el código de `AdminDashboard.js`: Copia todo el código del bloque `UPDATE FILE: /components/Admin/AdminDashboard.js`.
10. Abre el archivo `components/Admin/AdminDashboard.js`: En tu proyecto local, abre este archivo.
11. Reemplaza el contenido: Borra todo el contenido actual y pega el nuevo código.
12. Guarda el archivo.
13. Copia el código de `EmployeeManagement.js`: Copia todo el código del bloque `UPDATE FILE: /components/Admin/EmployeeManagement.js`.
14. Abre el archivo `components/Admin/EmployeeManagement.js`: En tu proyecto local, abre este archivo.
15. Reemplaza el contenido: Borra todo el contenido actual y pega el nuevo código.
16. Guarda el archivo.
17. Copia el código de `mock/employees.js`: Copia todo el código del bloque `UPDATE FILE: /mock/employees.js`.
18. Abre el archivo `mock/employees.js`: En tu proyecto local, abre este archivo.
19. Reemplaza el contenido: Borra todo el contenido actual y pega el nuevo código.
20. Guarda el archivo.
21. Copia el código de `mock/attendanceRecords.js`: Copia todo el código del bloque `UPDATE FILE: /mock/attendanceRecords.js`.
22. Abre el archivo `mock/attendanceRecords.js`: En tu proyecto local, abre este archivo.
23. Reemplaza el contenido: Borra todo el contenido actual y pega el nuevo código.
24. Guarda el archivo.
25. Sube los cambios a GitHub: Sigue los pasos de `git add .`, `git commit -m "Mensaje"` y `git push origin main` que te expliqué antes.

Para asegurar que la vista previa funcione correctamente:

*   Limpia el `localStorage`: Es muy importante que limpies el `localStorage` de tu navegador para que la aplicación cargue los datos iniciales de esta versión.
    1.  Abre tu aplicación en el navegador.
    2.  Abre las Herramientas de Desarrollador (`F12` o `Ctrl+Shift+I`).
    3.  Ve a la pestaña "Application" (Aplicación) o "Storage" (Almacenamiento).
    4.  En el menú de la izquierda, busca "Local Storage" y haz clic en la URL de tu aplicación.
    5.  Borra todas las claves relacionadas con tu aplicación (ej. `employees`, `attendanceRecords`, `groups`, `adminUsers`). Puedes hacer clic derecho en cada una y seleccionar "Delete" o "Clear all" si te da la opción.
    6.  Recarga la página de tu aplicación.

Ahora, los colaboradores podrán ingresar su código, y la aplicación lo usará para buscar su información y registrar su asistencia.

FILES:
// DONE