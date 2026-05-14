import { useState, useEffect } from "react";
import { taskService } from "../services/api";
import { validateTitle, validateDescription, validateDueDate } from "../utils/validations";

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
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });
  const [formErrors, setFormErrors] = useState({});
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
    const errors = {};
    const titleErr = validateTitle(newTask.title);
    const descErr = validateDescription(newTask.description);
    const dateErr = validateDueDate(newTask.dueDate);
    if (titleErr) errors.title = titleErr;
    if (descErr) errors.description = descErr;
    if (dateErr) errors.dueDate = dateErr;
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setFormErrors({});
    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        dueDate: new Date(newTask.dueDate).toISOString(),
      };
      await taskService.create(taskData);
      setNewTask({ title: "", description: "", dueDate: "" });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const clearFormField = (field) =>
    setFormErrors((prev) => ({ ...prev, [field]: null }));

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
    <div>
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">Mis Tareas</h1>
            <p className="page-subtitle">Gestiona tus tareas pendientes y completadas</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {showForm ? "Cancelar" : "Nueva Tarea"}
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card card-form">
          <div className="card-body">
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label>Título de la tarea *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => { setNewTask({ ...newTask, title: e.target.value }); clearFormField("title"); }}
                    className={formErrors.title ? "input-error" : ""}
                    placeholder="Describe la tarea..."
                  />
                  {formErrors.title && <span className="field-error">{formErrors.title}</span>}
                </div>
                <div className="form-group">
                  <label>Fecha límite *</label>
                  <input
                    type="datetime-local"
                    value={newTask.dueDate}
                    onChange={(e) => { setNewTask({ ...newTask, dueDate: e.target.value }); clearFormField("dueDate"); }}
                    className={formErrors.dueDate ? "input-error" : ""}
                  />
                  {formErrors.dueDate && <span className="field-error">{formErrors.dueDate}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Descripción (opcional)</label>
                <input
                  type="text"
                  value={newTask.description}
                  onChange={(e) => { setNewTask({ ...newTask, description: e.target.value }); clearFormField("description"); }}
                  className={formErrors.description ? "input-error" : ""}
                  placeholder="Agrega detalles adicionales..."
                />
                {formErrors.description && <span className="field-error">{formErrors.description}</span>}
              </div>
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

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Filtrar:</span>
          <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todas</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completadas</option>
            <option value="overdue">Vencidas</option>
          </select>
        </div>
        <span className="task-count">
          {filteredTasks.length} tarea{filteredTasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {error && (
        <div className="error-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <div className="card">
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
              {filter === "all" ? "Crea tu primera tarea para comenzar" : "No hay tareas con este filtro"}
            </p>
          </div>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((task) => {
              const taskStatus = getTaskStatus(task);
              return (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-item-content">
                    <div className="task-item-title">{task.title}</div>
                    {task.description && (
                      <div className="task-item-description">{task.description}</div>
                    )}
                    <div className="task-item-meta">
                      {task.dueDate && (
                        <span className="task-item-date">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                      <span className={`status-badge status-${taskStatus.class || 'pending'}`}>
                        {taskStatus.status}
                      </span>
                    </div>
                  </div>
                  <div className="task-item-actions">
                    {!task.completed && taskStatus.class !== "overdue" && (
                      <button onClick={() => handleComplete(task.id)} className="btn btn-success btn-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
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
    </div>
  );
}