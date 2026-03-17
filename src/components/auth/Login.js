import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../../lib/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Title from "../header/Header";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { accessToken, user } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("currentUser", JSON.stringify(user));
      Swal.fire({
        icon: "success",
        title: "Logged in successfully",
      });
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Please check your email and password",
      });
    } finally {
      setLoading(false);
    }
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="space-y-6">
      <Title />
      <div className="flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-4 rounded-xl border border-border bg-slate-900/70 p-6 shadow-lg"
        >
          <h1 className="text-xl font-semibold text-slate-50 text-center">
            Sign in
          </h1>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Email</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Password</label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-xs text-slate-400 text-center">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={goToSignup}
              className="text-primary underline underline-offset-2"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

