import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Use `next/navigation` for routing in the app directory

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false); // Track if it's client-side
  const router = useRouter();

  // Ensure router is only used on the client-side
  useEffect(() => {
    setIsClient(true); // Set client-side flag once the component is mounted
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/login", { username, password });

      if (res.status === 200) {
        // Redirect to the admin page upon successful login
        if (isClient) {
          router.push("/admin");
        }
      }
    } catch (err) {
      // Handle login failure
      if (err.response) {
        setError(err.response.data.message); // Show error from the response
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  if (!isClient) {
    return null; // Ensure nothing is rendered on the server-side
  }

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
