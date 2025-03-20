import { createSignal } from "solid-js";

export const [isAuthenticated, setIsAuthenticated] = createSignal(false);

export async function checkAuthStatus() {
  const res = await fetch("http://localhost:3000/api/profile", {
    method: "POST",
    credentials: "include" // ✅ Ensure cookies are sent
  });

  setIsAuthenticated(res.ok);
}