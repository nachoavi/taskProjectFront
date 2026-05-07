import { useState, useEffect } from "react";
import { taskService } from "../services/api";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
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
      await taskService.create(newTask);
      setNewTask({ title: "", description: "" });
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
      ) : tasks.length === 0 ? (
        <p className="empty">No hay tareas</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              <div className="task-info">
                <h3>{task.title}</h3>
                {new Date(task.createdAt).toLocaleString() && (
                  <p>{new Date(task.createdAt).toLocaleString()}</p>
                )}
                {task.description && <p>{task.description}</p>}
              </div>
              <div className="task-actions">
                {!task.completed && (
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="btn-complete"
                  >
                    Completar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
