import { createSignal } from "solid-js";
import { fromFetch } from "rxjs/fetch";
import { switchMap, catchError } from "rxjs/operators";
import { of } from "rxjs";
import "../app.css";

const btnClass = 'rounded border-2 border-black bg-gray-300 px-4 transition-all hover:bg-gray-400 active:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-400'
const baseUrl = "http://localhost:3000/api"

export default function AuthPage() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [message, setMessage] = createSignal("");

  const authAction = (endpoint: string)=> ()  => {
    fromFetch(`${baseUrl}/${endpoint}`, {
      method: "POST", credentials: "include",//Sends & receives cookies
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username(), password: password() }),
    }).pipe(
      switchMap((res) => res.text()),
      catchError((err) => of(`Error: ${err.message}`))
    ).subscribe(setMessage);
  };

  const action = (endpoint: string)=> ()  => {
    fromFetch(`${baseUrl}/${endpoint}`, {
      method: "POST", credentials: "include",
    }).pipe(
      switchMap((res) => res.text()),//convert response to text
      catchError((err) => of(`Error: ${err.message}`))
    ).subscribe(setMessage);
  };

  return <div class="text-center">
    <h2>Auth Demo (RxJS)</h2>
    <input type="text" placeholder="Username" onInput={(e) => setUsername(e.currentTarget.value)} />
    <input type="password" placeholder="Password" onInput={(e) => setPassword(e.currentTarget.value)} />

    <button class={btnClass} onClick={authAction("register")}>Sign Up</button>
    <button class={btnClass} onClick={authAction("login")}>Log In</button>
    <button class={btnClass} onClick={action("profile")}>Check Me</button>
    <button class={btnClass} onClick={action("logout")}>Logout</button>

    <p class="mt-5 ml-20 text-xs text-left">
      <b>Response:</b> {message()}
    </p>
  </div>;
}
