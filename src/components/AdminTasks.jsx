import { useState, useEffect } from "react";
import { taskService, adminUserService } from "../services/api";
import { Link } from "react-router-dom";

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", userId: "" });

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
      setError("Título y usuario son requeridos");
      return;
    }
    try {
      await taskService.createByAdmin({
        title: newTask.title,
        description: newTask.description,
        userId: parseInt(newTask.userId),
      });
      setNewTask({ title: "", description: "", userId: "" });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    try {
      await taskService.delete(id);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "all"
      ? true
      : filter === "true"
        ? task.completed
        : !task.completed,
  );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Todas las Tareas</h2>
        <div>
          <Link to="/admin/users" className="back-link">
            Usuarios
          </Link>
          {" | "}
          <Link to="/tasks">Mis Tareas</Link>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nueva Tarea'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="task-form">
          <input
            type="text"
            placeholder="Título"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <select
            value={newTask.userId}
            onChange={(e) => setNewTask({ ...newTask, userId: e.target.value })}
          >
            <option value="">Seleccionar usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
          <button type="submit">Crear Tarea</button>
        </form>
      )}

      <div className="filter">
        <label>Filtrar:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Todas</option>
          <option value="false">Pendientes</option>
          <option value="true">Completadas</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p>Cargando...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="empty">No hay tareas</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.user.username}</td>
                <td>
                  <span
                    className={`role-badge ${task.completed ? "admin" : "user"}`}
                  >
                    {task.completed ? "Completada" : "Pendiente"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="btn-delete"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
