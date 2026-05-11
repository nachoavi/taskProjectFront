import { useState, useEffect } from "react";
import { taskService } from "../services/api";

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

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const filterParams = filter === "all" ? {} : { completed: filter };
      const data = await taskService.getAll(filterParams);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
      };
      if (newTask.dueDate) {
        taskData.dueDate = new Date(newTask.dueDate).toISOString();
      }
      await taskService.create(taskData);
      setNewTask({ title: "", description: "", dueDate: "" });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleComplete = async (id) => {
    try {
      await taskService.complete(id);
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
    <div className="tasks-container">
      <div className="tasks-header">
        <h2>Mis Tareas</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "+ Nueva Tarea"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="task-form">
          <input
            type="text"
            placeholder="Título"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <input
            type="datetime-local"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          />
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
        <ul className="task-list">
          {filteredTasks.map((task) => {
            const taskStatus = getTaskStatus(task);
            return (
              <li
                key={task.id}
                className={`task-item ${taskStatus.class}`}
              >
                <div className="task-info">
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  {task.dueDate && (
                    <p className="due-date">Límite: {formatDate(task.dueDate)}</p>
                  )}
                  <span className={`role-badge ${taskStatus.class}`}>
                    {taskStatus.status}
                  </span>
                </div>
                <div className="task-actions">
                  {!task.completed && taskStatus.class !== "overdue" && (
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="btn-complete"
                    >
                      Completar
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}