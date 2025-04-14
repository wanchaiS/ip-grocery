import { Outlet } from "react-router";
import Layout from "./components/layout/Layout";
import { AppContextProvider } from "./context/AppContext";

export default function Providers() {
  return (
    <AppContextProvider>
      <Layout>
        <Outlet />
      </Layout>
    </AppContextProvider>
  );
}
