import React, { useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import InputBox from "../../components/InputBox";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await FetchData("auth/login", "post", credentials);

      if (response.status === 200) {
        setSuccess("Login successful!");
        localStorage.setItem("AccessToken", response.data.token); // Save token to localStorage
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Login</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <InputBox
          LabelName="Email"
          Type="email"
          Name="email"
          Value={credentials.email}
          Placeholder="Enter your email"
          onChange={handleChange}
        />

        {/* Password Input */}
        <InputBox
          LabelName="Password"
          Type="password"
          Name="password"
          Value={credentials.password}
          Placeholder="Enter your password"
          onChange={handleChange}
        />

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;