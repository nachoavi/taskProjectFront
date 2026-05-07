import { useState, useEffect } from "react";
import { adminUserService } from "../services/api";
import { Link } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminUserService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await adminUserService.deleteById(id);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Gestión de Usuarios</h2>
        <Link to="/admin/tasks" className="back-link">
          ← Volver a Tareas
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p>Cargando...</p>
      ) : users.length === 0 ? (
        <p className="empty">No hay usuarios</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(user.id)}
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
