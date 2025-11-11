import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

export default function LoginForm(props) {
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const verificationStatus = useAuthStore(s => s.verificationStatus)
  const setVerificationStatus = useAuthStore(s => s.setVerificationStatus);

  const [identifier, setIdentifier] = useState("")
  const [userPassword, setUserPassword] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const identifier = e.target.identifier.value;
    const userPassword = e.target.userPassword.value;

    const { ok, payload, error } = await login({ identifier, userPassword });
    console.log(ok, payload, error);

    if (ok) {
      props.navigate("/");
      return ok
    } else {
      const msg = payload?.message || error?.message || "Login failed";
      setVerificationStatus(msg);
    }
    setLoading(false);
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-8">ReelJolly</h1>

      <form
        onSubmit={async (e) => { handleLogin(e); }}
        className="flex flex-col gap-3"
      >
        <input
          type="text"
          placeholder="mobile number, username or email"
          name="identifier"
          className="border rounded-sm px-3 py-2 text-sm"
          value={identifier}                 // <-- FIX: use identifier
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input
          type="password"
          name="userPassword"
          placeholder="Password"
          className="border rounded-sm px-3 py-2 text-sm"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          required
        />
        <p>{props.verificationStatus}</p>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded-md font-semibold mt-2 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-3 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <p className="text-xs text-center text-blue-900 mt-3 cursor-pointer">
        Forgot password?
      </p>

      <div className="border border-gray-300 bg-white mt-4 p-4 text-center">
        <p>
          Don’t have an account?{" "}
          <Link
            to="/verify"
            className="text-blue-500 cursor-pointer"
            onClick={() => props.setLoginSection(false)} // toggle to signup
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
