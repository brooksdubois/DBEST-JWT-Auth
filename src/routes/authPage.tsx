import { createSignal } from "solid-js";
import { fromFetch } from "rxjs/fetch";
import { switchMap, catchError } from "rxjs/operators";
import { of } from "rxjs";

const buttonClass = 'rounded border-2 border-black bg-gray-300 px-4 transition-all hover:bg-gray-400 active:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-400'

export default function AuthClient() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [message, setMessage] = createSignal("");

  const authAction = (endpoint: string) => {
    fromFetch(`http://localhost:3000/api/${endpoint}`, {
      method: "POST",
      credentials: "include", // Sends & receives cookies
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username(), password: password() }),
    }).pipe(
      switchMap((res) => res.text()), // Convert response to text
      catchError((err) => of(`Error: ${err.message}`)) // Handle errors
    ).subscribe(setMessage);
  };

  const checkMe = () => {
    fromFetch("http://localhost:3000/api/profile", {
      method: "POST",
      credentials: "include",
    }).pipe(
      switchMap((res) => res.text()),
      catchError((err) => of(`Error: ${err.message}`))
    ).subscribe(setMessage);
  };

  const logout = () => {
    fromFetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include", // ✅ Ensures cookie is cleared on the server
    }).pipe(
      switchMap((res) => res.text()),
      catchError((err) => of(`Error: ${err.message}`))
    ).subscribe(setMessage);
  };

  return (
    <div>
      <h2>Auth Demo (RxJS)</h2>
      <input type="text" placeholder="Username" onInput={(e) => setUsername(e.currentTarget.value)} />
      <input type="password" placeholder="Password" onInput={(e) => setPassword(e.currentTarget.value)} />

      <button class={buttonClass} onClick={() => authAction("register")}>Sign Up</button>
      <button class={buttonClass} onClick={() => authAction("login")}>Log In</button>
      <button class={buttonClass} onClick={checkMe}>Check Me</button>
      <button class={buttonClass} onClick={logout}>Logout</button>

      <p>Response: {message()}</p>
    </div>
  );
}
