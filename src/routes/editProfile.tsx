import { createEffect } from "solid-js";
import { isAuthenticated, checkAuthStatus } from "~/utils/globalAuth";
import { useNavigate } from '@solidjs/router';
import "../app.css";

export default function EditProfile() {
  const navigate = useNavigate();

  createEffect(() => {
    checkAuthStatus();
    if (!isAuthenticated()) {
      navigate("/authPage");
    }
  });

  return <>
    <h2>Edit Profile</h2>
    <p>Welcome, you can edit your profile here.</p>
  </>;
}
