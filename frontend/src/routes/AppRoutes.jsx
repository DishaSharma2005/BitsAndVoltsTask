import { Routes, Route, Navigate } from "react-router-dom";

import UsersList from "../pages/UsersList";
import UserForm from "../pages/UserForm";
import UserView from "../pages/UserView";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users" />} />

      <Route path="/users" element={<UsersList />} />
      <Route path="/users/new" element={<UserForm mode="create" />} />
      <Route path="/users/:id/edit" element={<UserForm mode="edit" />} />
      <Route path="/users/:id" element={<UserView />} />

      <Route path="*" element={<h2>404 Not Found</h2>} />
    </Routes>
  );
}
