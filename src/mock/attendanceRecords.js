export const employees = [
  {
    id: 1,
    name: "Juan Pérez López",
    email: "juan@gmail.com",
    department: "Ventas"
  },
  {
    id: 2,
    name: "María García Rodríguez",
    email: "maria@gmail.com",
    department: "RH"
  }
];

export const attendanceRecords = [
  {
    employeeId: 1,
    date: new Date().toISOString().split('T')[0],
    status: "present",
    timestamp: new Date().toISOString()
  },
  {
    employeeId: 2,
    date: new Date().toISOString().split('T')[0],
    status: "sick",
    timestamp: new Date().toISOString()
  }
];

// DONE