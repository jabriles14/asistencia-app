export const attendanceRecords = [
  { 
    employeeId: 1, 
    date: new Date().toISOString().split('T')[0], 
    status: "present",
    timestamp: new Date().toISOString(),
    type: "entry",
    email: "juan@gmail.com",
    group: "Grupo A"
  },
  { 
    employeeId: 2, 
    date: new Date().toISOString().split('T')[0], 
    status: "sick",
    timestamp: new Date().toISOString(),
    type: "entry",
    email: "maria@gmail.com",
    group: "Grupo B"
  },
  { 
    employeeId: 3, 
    date: new Date().toISOString().split('T')[0], 
    status: "psg",
    timestamp: new Date().toISOString(),
    type: "entry",
    email: "carlos@gmail.com",
    group: "Grupo A"
  },
  { 
    employeeId: 4, 
    date: new Date().toISOString().split('T')[0], 
    status: "absent",
    timestamp: new Date().toISOString(),
    type: "entry",
    email: "ana@gmail.com",
    group: "Grupo C"
  },
  { 
    employeeId: 1, 
    date: new Date().toISOString().split('T')[0], 
    status: "exit",
    reason: "personal",
    timestamp: new Date().toISOString(),
    type: "exit",
    email: "juan@gmail.com",
    group: "Grupo A"
  },
  // Registros de días anteriores para mostrar en el historial
  { 
    employeeId: 1, 
    date: "2023-11-14", 
    status: "present",
    timestamp: "2023-11-14T08:15:00",
    type: "entry",
    email: "juan@gmail.com",
    group: "Grupo A"
  },
  { 
    employeeId: 2, 
    date: "2023-11-14", 
    status: "present",
    timestamp: "2023-11-14T08:20:00",
    type: "entry",
    email: "maria@gmail.com",
    group: "Grupo B"
  }
];