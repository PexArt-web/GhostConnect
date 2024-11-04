import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
export const useLogin = () => {
  const [error, setError] = useState(null);

  const { dispatch } = useAuthContext();

  const login = async (username, email, password) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/api/user/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const json = await response.json();
      if (!response.ok) {
        setError(json.error);
      }

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(json));

        dispatch({ type: "LOGIN", payload: json });
      }
    } catch (error) {
      throw Error(error);
    }
  };

  return { login, error };
};
