import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/AxiosConfig";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addUser } from "../../Redux/UserSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleEmail = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePassword = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    if (!validatePassword(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSignupRedirect = () => navigate("/signup");

  const handleLogin = async (event) => {
    event.preventDefault();

    if (emailError || passwordError) {
      toast.error("Please correct the errors before submitting");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });
      toast.success(response.data.message);

      dispatch(addUser(response.data.userData));

      navigate("/home");
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full h-96 bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 p-6">
        <form className="max-w-sm mx-auto" onSubmit={handleLogin}>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-4">
              Your email
            </label>
            <input
              type="email"
              id="email"
              onChange={handleEmail}
              className={`shadow-sm bg-gray-50 border ${
                emailError ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="name@.com"
              required
            />
            {emailError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {emailError}
              </p>
            )}
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your password
            </label>
            <input
              type="password"
              id="password"
              onChange={handlePassword}
              placeholder="••••••••"
              className={`shadow-sm bg-gray-50 border ${
                passwordError ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              required
            />
            {passwordError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {passwordError}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleSignupRedirect}
            className="font-medium text-primary-600 hover:underline dark:text-primary-500 text-center mt-4 block w-full text-sm">
            Don't have an account? Signup here
          </button>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 mt-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!!emailError || !!passwordError}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
