import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/AxiosConfig";

function Signup() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const navigate = useNavigate();

  const handleName = (e) => {
    setUserName(e.target.value);
    if (nameError && validateName(e.target.value)) {
      setNameError("");
    }
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    if (emailError && validateEmail(e.target.value)) {
      setEmailError("");
    }
  };

  const handleMobile = (e) => {
    setMobile(e.target.value);
    if (mobileError && validateMobile(e.target.value)) {
      setMobileError("");
    }
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    if (passwordError && validatePassword(e.target.value)) {
      setPasswordError("");
    }
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    if (confirmPasswordError && e.target.value === password) {
      setConfirmPasswordError("");
    }
  };

  const handleImage = (e) => setImage(e.target.files[0]);

  const handleLoginRedirect = () => {
    navigate("/");
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{4,}$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(mobile);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  useEffect(() => {
    if (userName && !validateName(userName)) {
      setNameError(
        "Name must be at least 4 characters and contain only alphabets."
      );
    }
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
    }
    if (mobile && !validateMobile(mobile)) {
      setMobileError("Phone number must be 10 digits.");
    }
    if (password && !validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    }
    if (confirmPassword && confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
    }
  }, [userName, email, mobile, password, confirmPassword]);

  async function handleSignup(event) {
    event.preventDefault();
    setIsLoading(true);

    if (
      !validateName(userName) ||
      !validateEmail(email) ||
      !validateMobile(mobile) ||
      !validatePassword(password) ||
      password !== confirmPassword
    ) {
      setIsLoading(false);
      return;
    }

    try {
      const UploadFile = image;
      const formData = new FormData();
      formData.append("file", UploadFile);
      formData.append("upload_preset", "profilepicturepreset");

      const res = await axiosInstance.post(
        `https://api.cloudinary.com/v1_1/dqysji5ni/image/upload`,
        formData,
        { withCredentials: false }
      );

      const response = await axiosInstance.post("/user/singup", {
        userName,
        email,
        mobile,
        password,
        image: res.data.secure_url,
      });

      navigate("/");
      return toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <div className="p-6 space-y-4">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
            Create an Account
          </h1>
          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label
                htmlFor="text"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                Your name
              </label>
              <input
                value={userName}
                onChange={handleName}
                type="text"
                name="text"
                id="text"
                className={`bg-gray-50 border ${
                  nameError ? "border-red-500" : "border-gray-300"
                } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                required
              />
              {nameError && (
                <p className="text-red-500 text-xs mt-1">{nameError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className={`bg-gray-50 border ${
                  emailError ? "border-red-500" : "border-gray-300"
                } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="name@.com"
                value={email}
                onChange={handleEmail}
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={mobile}
                onChange={handleMobile}
                className={`bg-gray-50 border ${
                  mobileError ? "border-red-500" : "border-gray-300"
                } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="Enter your phone number"
                pattern="[0-9]{10}"
                required
              />
              {mobileError && (
                <p className="text-red-500 text-xs mt-1">{mobileError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={handlePassword}
                placeholder="••••••••"
                className={`bg-gray-50 border ${
                  passwordError ? "border-red-500" : "border-gray-300"
                } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                required
              />
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                Confirm password
              </label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                value={confirmPassword}
                onChange={handleConfirmPassword}
                placeholder="••••••••"
                className={`bg-gray-50 border ${
                  confirmPasswordError ? "border-red-500" : "border-gray-300"
                } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                required
              />
              {confirmPasswordError && (
                <p className="text-red-500 text-xs mt-1">
                  {confirmPasswordError}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="image"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                Upload Profile Image:
              </label>
              <input
                type="file"
                name="image"
                id="image"
                onChange={handleImage}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>
            <button
              type="submit"
              disabled={
                isLoading ||
                nameError ||
                emailError ||
                mobileError ||
                passwordError ||
                confirmPasswordError
              }
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing up...
                </span>
              ) : (
                "Sign up"
              )}
            </button>
          </form>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <a
              onClick={handleLoginRedirect}
              className="font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
