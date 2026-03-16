import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./globalContexts/AuthContext"

export const AuthGuard = () => {
  const { isLoggedIn, isProtectEnable } = useAuth();

  // ログイン機能が無効なら、常に中身を表示
  if (!isProtectEnable) {
    return <Outlet />;
  }

  // ログイン機能が有効で、未ログインなら強制的にログインへ
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // ログイン済みなら中身を表示
  return <Outlet />;
};