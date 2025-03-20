import Layout from "../components/Layout";
import { ParentProps } from "solid-js";

const RootLayout = (props: ParentProps) => {
  return <Layout>{props.children}</Layout>;
};

export default RootLayout;