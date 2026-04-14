import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

export default function CreatorRoute({
  children,
  creatorId,
}: {
  children: ReactNode;
  creatorId: number;
}) {
  const { user } = useAuth();

  if (!user || user.id !== creatorId) {
    return <Navigate to="/events" replace />;
  }

  return <>{children}</>;
}
