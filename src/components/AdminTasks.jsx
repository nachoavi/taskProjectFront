import { useState, useEffect } from "react";
import { taskService, adminUserService } from "../services/api";
import { Link } from "react-router-dom";

function getTaskStatus(task) {
  if (task.completed) return { status: "completed", class: "completed" };

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
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    userId: "",
    dueDate: "",
  });

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
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        userId: parseInt(newTask.userId),
      };
      if (newTask.dueDate) {
        taskData.dueDate = new Date(newTask.dueDate).toISOString();
      }
      await taskService.createByAdmin(taskData);
      setNewTask({ title: "", description: "", userId: "", dueDate: "" });
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

  const filteredTasks = tasks.filter((task) => {
    const taskStatus = getTaskStatus(task);
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "pending")
      return !task.completed && taskStatus.class !== "overdue";
    if (filter === "overdue") return taskStatus.class === "overdue";
    return true;
  });

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Todas las Tareas</h2>
        <div>
          <Link to="/admin/users">Usuarios</Link>
          {" | "}
          <Link to="/tasks">Mis Tareas</Link>
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "+ Nueva Tarea"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="task-form">
          <label>Título:</label>
          <input
            type="text"
            placeholder="Título"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <label>Descripción:</label>
          <input
            type="text"
            placeholder="Descripción"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            required
          />
          <label>Fecha límite:</label>
          <input
            type="datetime-local"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
            required
          />
          <select
            value={newTask.userId}
            onChange={(e) => setNewTask({ ...newTask, userId: e.target.value })}
            required
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
          <option value="pending">Pendientes</option>
          <option value="completed">Completadas</option>
          <option value="overdue">Vencidas</option>
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
              <th>Fecha Límite</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => {
              const taskStatus = getTaskStatus(task);
              return (
                <tr key={task.id} className={taskStatus.class}>
                  <td>{task.id}</td>
                  <td>{task.title}</td>
                  <td>{task.user?.username || "-"}</td>
                  <td>{formatDate(task.dueDate)}</td>
                  <td>
                    <span
                      className={`role-badge ${task.completed ? "completed" : taskStatus.class}`}
                    >
                      {task.completed ? "Completada" : taskStatus.status}
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
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
