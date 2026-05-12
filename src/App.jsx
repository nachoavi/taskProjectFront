import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './components/AuthLayout';
import ProtectedLayout from './components/ProtectedLayout';
import DemoProtectedLayout from './components/demo/DemoProtectedLayout';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import AdminUsers from './components/AdminUsers';
import AdminTasks from './components/AdminTasks';
import { DemoTaskList, DemoAdminUsers, DemoAdminTasks } from './components/demo';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<ProtectedLayout />}>
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/tasks" element={<AdminTasks />} />
          </Route>
          <Route element={<DemoProtectedLayout />}>
            <Route path="/demo/tasks" element={<DemoTaskList />} />
            <Route path="/demo/admin/users" element={<DemoAdminUsers />} />
            <Route path="/demo/admin/tasks" element={<DemoAdminTasks />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}