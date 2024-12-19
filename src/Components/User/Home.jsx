import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Background from "../../assets/Home-Backgound.jpg";
import { addUser, logoutUser } from "../../Redux/UserSlice";
import axiosInstance from "../../utils/AxiosConfig";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

function Home() {
  const userData = useSelector((store) => store.user.userDatas);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  //edit states
  const [editName, setEditName] = useState(userData?.name || "");
  const [editEmail, setEditEmail] = useState(userData?.email || "");
  const [editMobile, setEditMobile] = useState(userData?.mobile || "");
  const [editImage, setEditImage] = useState(userData?.image || "");
  const [prevImage, setPreImage] = useState("");

  useEffect(() => {}, [userData, navigate]);
  // validation states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");

  // validation functions
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

  //onChange fn with validation
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEditEmail(newEmail);
    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleMobileChange = (e) => {
    const newMobile = e.target.value;
    setEditMobile(newMobile);
    if (!validateMobile(newMobile)) {
      setMobileError("Phone number must be 10 digits");
    } else {
      setMobileError("");
    }
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setEditName(newName);
    if (!validateName(newName)) {
      setNameError(
        "Name must be at least 4 characters and contain only alphabets"
      );
    } else {
      setNameError("");
    }
  };

  const handleLogout = async () => {
    dispatch(logoutUser());
    const response = await axiosInstance.patch("/user/logout");
    if (response.data.success) {
      navigate("/");
    }
  };

  const imageUrl = userData?.image;

  async function handleUpdate() {
    try {
      let imageUrl = editImage;
      if (typeof editImage !== "string") {
        console.log("edit image ", editImage);

        const UploadFile = editImage;
        const formData = new FormData();
        formData.append("file", UploadFile);
        formData.append("upload_preset", "profilepicturepreset");

        const res = await axiosInstance.post(
          `https://api.cloudinary.com/v1_1/dqysji5ni/image/upload`,
          formData,
          { withCredentials: false }
        );
        imageUrl = res.data.secure_url;
      }

      const _id = userData._id;
      const response = await axiosInstance.post("/user/edituser", {
        _id,
        editEmail,
        editName,
        editMobile,
        editImage: imageUrl,
      });

      dispatch(addUser(response.data.updateData));
      setIsEditing(false);
      return toast.success(response.data.message);
    } catch (error) {
      if (error.response) {
        console.log(error);
        return toast.error(error.response.data.message);
      }
    }
  }

  return (
    <div
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
      className="flex items-center justify-center">
      <div className="flex flex-col w-500 h-550 items-center bg-[#24728060] border border-gray-700 rounded-lg shadow-lg md:flex-row max-w-2xl p-8 hover:bg-[#24748380] dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div className="flex flex-col justify-between leading-normal">
          {isEditing ? (
            <div className="relative w-52 h-52 m-5">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  setEditImage(e.target.files[0]);
                  const preve = URL.createObjectURL(e.target.files[0]);
                  setPreImage(preve);
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-full text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Change Profile</span>
              </div>
              <img
                className="w-full h-full rounded-full object-cover"
                src={prevImage || imageUrl}
                alt="Current profile"
              />
            </div>
          ) : (
            <img
              className="w-52 h-52 m-20 rounded-full object-cover"
              src={imageUrl}
              alt="Profile"
            />
          )}
          <div className="mb-4">
            {isEditing ? (
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="mb-1 text-sm font-medium text-[#e0e4dc]">
                  User name:
                </label>
                <input
                  id="name"
                  type="text"
                  value={editName}
                  onChange={handleNameChange}
                  className={`px-3 py-2 bg-[#ffffff20] text-[#e0e4dc] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4dea99] ${
                    nameError ? "border-2 border-red-500" : ""
                  }`}
                />
                {nameError && (
                  <p className="text-red-500 text-xs mt-1">{nameError}</p>
                )}
              </div>
            ) : (
              <h5 className="text-3xl font-bold tracking-tight text-[#e0e4dc] dark:text-[#e0e4dc]">
                User name: {userData?.name || "No user name available"}
              </h5>
            )}
          </div>

          <div className="mb-4">
            {isEditing ? (
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="mb-1 text-sm font-medium text-[#e0e4dc]">
                  E-mail:
                </label>
                <input
                  id="email"
                  value={editEmail}
                  type="text"
                  onChange={handleEmailChange}
                  className={`px-3 py-2 bg-[#ffffff20] text-[#e0e4dc] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4dea99] ${
                    emailError ? "border-2 border-red-500" : ""
                  }`}
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>
            ) : (
              <p className="text-lg font-normal text-[#c6c9c1] dark:text-[#c6c9c1]">
                <b>E-mail:</b> {userData?.email || "No user email available"}
              </p>
            )}
          </div>
          <div className="mb-4">
            {isEditing ? (
              <div className="flex flex-col">
                <label
                  htmlFor="mobile"
                  className="mb-1 text-sm font-medium text-[#e0e4dc]">
                  Mobile:
                </label>
                <input
                  id="mobile"
                  type="text"
                  value={editMobile}
                  onChange={handleMobileChange}
                  className={`px-3 py-2 bg-[#ffffff20] text-[#e0e4dc] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4dea99] ${
                    mobileError ? "border-2 border-red-500" : ""
                  }`}
                />
                {mobileError && (
                  <p className="text-red-500 text-xs mt-1">{mobileError}</p>
                )}
              </div>
            ) : (
              <p className="text-lg font-normal text-[#c6c9c1] dark:text-[#c6c9c1]">
                <b>Mobile:</b>{" "}
                {userData?.mobile || "No user mobile number available"}
              </p>
            )}
          </div>

          <div className="flex space-x-4">
            {isEditing ? (
              <button
                className="mt-4 px-4 py-2 bg-[#4dea99] text-black font-semibold rounded-lg shadow-md hover:bg-[#96e983] focus:outline-none focus:ring-2 focus:ring-[#4dea99] focus:ring-opacity-50"
                onClick={() => {
                  setIsEditing(false);
                  setPreImage(null);
                  setEditImage(userData.image);
                  // Clear validation errors
                  setNameError("");
                  setEmailError("");
                  setMobileError("");
                }}>
                Cancel
              </button>
            ) : (
              <button
                className="mt-4 px-4 py-2 bg-[#4dea99] text-black font-semibold rounded-lg shadow-md hover:bg-[#96e983] focus:outline-none focus:ring-2 focus:ring-[#4dea99] focus:ring-opacity-50"
                onClick={() => {
                  setIsEditing(true);
                  setEditEmail(userData.email);
                  setEditName(userData.name);
                  setEditMobile(userData.mobile);
                }}>
                Edit
              </button>
            )}

            {isEditing ? (
              <button
                className={`mt-4 px-4 py-2 bg-[#ff4d4d] text-white font-semibold rounded-lg shadow-md hover:bg-[#b72e2ebd] focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] focus:ring-opacity-50 ${
                  nameError || emailError || mobileError
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleUpdate}
                disabled={nameError || emailError || mobileError}>
                Save Changes
              </button>
            ) : (
              <button
                className="mt-4 px-4 py-2 bg-[#ff4d4d] text-white font-semibold rounded-lg shadow-md hover:bg-[#b72e2ebd] focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] focus:ring-opacity-50"
                onClick={() => {
                  setShowConfirmation(true);
                }}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                onClick={() => setShowConfirmation(false)}>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
