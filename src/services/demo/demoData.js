export const demoUser = {
  id: 1,
  username: "demo",
  email: "demo@demo.com",
  role: "admin"
};

export const demoUsers = [
  { id: 1, username: "María García", email: "maria.garcia@empresa.com", role: "user" },
  { id: 2, username: "Carlos López", email: "carlos.lopez@empresa.com", role: "user" },
  { id: 3, username: "Ana Martínez", email: "ana.martinez@empresa.com", role: "admin" },
  { id: 4, username: "Pedro Sánchez", email: "pedro.sanchez@empresa.com", role: "user" },
  { id: 5, username: "Laura Rodríguez", email: "laura.rodriguez@empresa.com", role: "user" },
  { id: 6, username: "Diego Fernández", email: "diego.fernandez@empresa.com", role: "user" },
  { id: 7, username: "Sofia Jiménez", email: "sofia.jimenez@empresa.com", role: "admin" },
  { id: 8, username: "Manuel Torres", email: "manuel.torres@empresa.com", role: "user" }
];

const now = new Date();
const hour = 60 * 60 * 1000;
const day = 24 * hour;

export const demoTasks = [
  {
    id: 1,
    title: "Preparar presentación trimestral",
    description: "Revisar datos del Q3 y crear diapositivas para la reunión de dirección",
    dueDate: new Date(now.getTime() + 2 * hour).toISOString(),
    completed: false,
    user: demoUsers[0]
  },
  {
    id: 2,
    title: "Revisar presupuesto de marketing",
    description: "Analizar gastos y proponer ajustes para el próximo trimestre",
    dueDate: new Date(now.getTime() + 1 * day).toISOString(),
    completed: false,
    user: demoUsers[1]
  },
  {
    id: 3,
    title: "Actualizar documentación técnica",
    description: "Documentar los nuevos endpoints de la API",
    dueDate: new Date(now.getTime() + 3 * day).toISOString(),
    completed: true,
    user: demoUsers[2]
  },
  {
    id: 4,
    title: "Reunión con proveedor de software",
    description: "Evaluar propuestas para el nuevo sistema de gestión",
    dueDate: new Date(now.getTime() - 2 * hour).toISOString(),
    completed: false,
    user: demoUsers[3]
  },
  {
    id: 5,
    title: "Capacitación del equipo",
    description: "Organizar sesión de formación sobre nuevas herramientas",
    dueDate: new Date(now.getTime() + 5 * day).toISOString(),
    completed: false,
    user: demoUsers[4]
  },
  {
    id: 6,
    title: "Auditoría de seguridad",
    description: "Realizar revisión de protocolos de seguridad de la información",
    dueDate: new Date(now.getTime() + 7 * day).toISOString(),
    completed: true,
    user: demoUsers[5]
  },
  {
    id: 7,
    title: "Optimizar base de datos",
    description: "Mejorar rendimiento de consultas lentas identificadas",
    dueDate: new Date(now.getTime() - 1 * day).toISOString(),
    completed: false,
    user: demoUsers[6]
  },
  {
    id: 8,
    title: "Planificar vacaciones de verano",
    description: "Coordinar calendario y cubrir ausencias del equipo",
    dueDate: new Date(now.getTime() + 14 * day).toISOString(),
    completed: false,
    user: demoUsers[7]
  },
  {
    id: 9,
    title: "Revisar contratos de proveedores",
    description: "Verificar condiciones y renovaciones próximas",
    dueDate: new Date(now.getTime() + 4 * hour).toISOString(),
    completed: false,
    user: demoUsers[0]
  },
  {
    id: 10,
    title: "Implementar feedback del cliente",
    description: "Aplicar mejoras sugeridas en la encuesta de satisfacción",
    dueDate: new Date(now.getTime() + 10 * day).toISOString(),
    completed: true,
    user: demoUsers[1]
  },
  {
    id: 11,
    title: "Migrar servidor de producción",
    description: "Planificar y ejecutar migración sin downtime",
    dueDate: new Date(now.getTime() - 6 * hour).toISOString(),
    completed: false,
    user: demoUsers[2]
  },
  {
    id: 12,
    title: "Preparar informe mensual",
    description: "Consolidar métricas y KPI's para el comité ejecutivo",
    dueDate: new Date(now.getTime() + 2 * day).toISOString(),
    completed: false,
    user: demoUsers[3]
  }
];