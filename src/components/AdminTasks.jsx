import { useState, useEffect } from "react";
import { taskService, adminUserService } from "../services/api";
import { Link } from "react-router-dom";

function getTaskStatus(task) {
  if (task.completed) return { status: "Completada", class: "completed" };
  if (!task.dueDate) return { status: "Sin fecha", class: "" };

  const now = new Date();
  const dueDate = new Date(task.dueDate);
  const hoursLeft = (dueDate - now) / (1000 * 60 * 60);

  if (hoursLeft < 0) return { status: "Vencida", class: "overdue" };
  if (hoursLeft <= 1) return { status: "Por vencer", class: "warning" };
  return { status: "Pendiente", class: "" };
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", userId: "", dueDate: "" });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllByAdmin();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await adminUserService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.userId) {
      setError("El título y usuario son obligatorios");
      return;
    }
    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        userId: parseInt(newTask.userId),
      };
      if (newTask.dueDate) taskData.dueDate = new Date(newTask.dueDate).toISOString();
      await taskService.createByAdmin(taskData);
      setNewTask({ title: "", description: "", userId: "", dueDate: "" });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar esta tarea? Esta acción no se puede deshacer.")) return;
    try {
      await taskService.delete(id);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const taskStatus = getTaskStatus(task);
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed && taskStatus.class !== "overdue";
    if (filter === "overdue") return taskStatus.class === "overdue";
    return true;
  });

  return (
    <div>
      <div className="breadcrumb">
        <span className="breadcrumb-item">
          <Link to="/admin/users">Gestión</Link>
        </span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Tareas</span>
      </div>

      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">Gestión de Tareas</h1>
            <p className="page-subtitle">Administra todas las tareas del sistema</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {showForm ? "Cancelar" : "Nueva Tarea"}
            </button>
            <Link to="/admin/users" className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
              Ver Usuarios
            </Link>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3 className="card-title">Crear Nueva Tarea</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label>Título de la tarea *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                    placeholder="Describe la tarea..."
                  />
                </div>
                <div className="form-group">
                  <label>Asignar a *</label>
                  <select
                    value={newTask.userId}
                    onChange={(e) => setNewTask({ ...newTask, userId: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)', fontSize: 14, fontFamily: 'inherit' }}
                  >
                    <option value="">Seleccionar usuario...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Descripción</label>
                  <input
                    type="text"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Agrega detalles adicionales..."
                  />
                </div>
                <div className="form-group">
                  <label>Fecha límite</label>
                  <input
                    type="datetime-local"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              {error && (
                <div className="error-message" style={{ marginBottom: 16 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && !showForm && (
        <div className="error-message" style={{ marginBottom: 24 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Todas las Tareas</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="filter-group">
              <span className="filter-label">Filtrar:</span>
              <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">Todas</option>
                <option value="pending">Pendientes</option>
                <option value="completed">Completadas</option>
                <option value="overdue">Vencidas</option>
              </select>
            </div>
            <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
              {filteredTasks.length} tarea{filteredTasks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <span>Cargando tareas...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <p className="empty-state-title">No hay tareas</p>
            <p className="empty-state-text">
              {filter === "all" ? "Crea una nueva tarea para comenzar" : "No hay tareas con este filtro"}
            </p>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Usuario</th>
                  <th>Fecha Límite</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => {
                  const taskStatus = getTaskStatus(task);
                  return (
                    <tr key={task.id} className={taskStatus.class === 'overdue' ? '' : taskStatus.class === 'warning' ? '' : ''}>
                      <td className="table-cell-id">{task.id}</td>
                      <td style={{ fontWeight: 500, color: 'var(--gray-900)' }}>{task.title}</td>
                      <td>
                        {task.user ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: 'var(--primary-light)',
                              color: 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 12,
                              fontWeight: 600
                            }}>
                              {task.user.username.charAt(0).toUpperCase()}
                            </span>
                            {task.user.username}
                          </span>
                        ) : '-'}
                      </td>
                      <td style={{ color: 'var(--gray-600)' }}>{formatDate(task.dueDate)}</td>
                      <td>
                        <span className={`status-badge status-${task.completed ? 'completed' : taskStatus.class || 'pending'}`}>
                          {task.completed ? "Completada" : taskStatus.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="btn btn-danger btn-sm"
                            title="Eliminar tarea"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3,6 5,6 21,6"/>
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                              <line x1="10" y1="11" x2="10" y2="17"/>
                              <line x1="14" y1="11" x2="14" y2="17"/>
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}