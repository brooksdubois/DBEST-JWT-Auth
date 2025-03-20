import { ParentProps } from "solid-js";
import { A } from '@solidjs/router';
import "../app.css"

const Layout = (props: ParentProps) => {
  return <div class="min-h-screen flex flex-col">
    <nav class="bg-blue-600 p-4 text-white">
      <div class="container mx-auto flex justify-center items-center">
        <div class="flex space-x-4">
          <a href='/'>Home</a>
          <a href='/authPage'>Auth Tester</a>
          <a href='/editProfile'>Edit Profile</a>
        </div>
      </div>
    </nav>
    <main class="flex-grow">{props.children}</main>
    <footer>
      <pre class="text-center">DrizzleORM + Bun + ElysiaJS + SolidStart + Tailwind CSS</pre>
    </footer>
  </div>;
};
export default Layout;