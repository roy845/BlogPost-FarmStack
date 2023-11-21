import { useEffect } from "react";
import Layout from "../components/Layout";
import { checkTokenExpiration } from "../Api/ServerAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import PostsList from "../components/PostsList";

const Dashboard = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    const checkToken = async () => {
      try {
        await checkTokenExpiration();
      } catch (error) {
        setAuth(null);
        localStorage.removeItem("auth");
        navigate("/");
      }
    };

    checkToken();
  }, [pathname]);
  return (
    <Layout title="Dashboard">
      <main style={{ marginTop: "30px" }}>
        <PostsList />
      </main>
    </Layout>
  );
};

export default Dashboard;
