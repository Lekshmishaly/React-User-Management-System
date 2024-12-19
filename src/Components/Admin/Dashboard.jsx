import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosConfig";
import {
  Edit,
  Trash2,
  Home,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    image: "",
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(4);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");

  async function fetchUserData() {
    try {
      const response = await axiosInstance.get("/admin/users");
      console.log("API Response:", response.data);
      setUsers(response.data.collectedDatas);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch users.");
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!editFormData.name.trim()) newErrors.name = "Name is required";
    if (!editFormData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(editFormData.email))
      newErrors.email = "Email is invalid";
    if (!editFormData.mobile.trim())
      newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(editFormData.mobile))
      newErrors.mobile = "Mobile number should be 10 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setEditFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      image: user.image,
    });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData({
        ...editFormData,
        image: file,
      });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    try {
      let imageUrl = editFormData.image;

      if (editFormData.image instanceof File) {
        const formData = new FormData();
        formData.append("file", editFormData.image);
        formData.append("upload_preset", "profilepicturepreset");

        const res = await axiosInstance.post(
          "https://api.cloudinary.com/v1_1/dqysji5ni/image/upload",
          formData,
          { withCredentials: false }
        );

        imageUrl = res.data.secure_url;
      }

      const url = `/admin/editAdmin/${editUserId}`;
      console.log("API URL:", url);
      const response = await axiosInstance.put(url, {
        ...editFormData,
        image: imageUrl,
      });

      setUsers(
        users.map((user) =>
          user._id === editUserId ? { ...user, ...response.data.user } : user
        )
      );

      toast.success(response.data.message);
      setEditUserId(null);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user.");
    }
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `/admin/deleteAdmin/${userToDelete}`
      );
      if (response.data.success) {
        setUsers(users.filter((user) => user._id !== userToDelete));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("deleting error", error);
      toast.error("Failed to delete user.");
    }
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const handleGoToHome = () => {
    navigate("/admin/home");
  };

  const goToAddNewUser = () => {
    navigate("/admin/addnewuser");
  };

  async function handleSearch() {
    try {
      const response = await axiosInstance.post("/admin/search", {
        search,
      });
      setUsers(response.data);
    } catch (error) {
      console.log("Error in search request:", error);
    }
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Admin Dashboard
        </h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* New search bar and button */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center w-full max-w-md">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    {editUserId === user._id ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleChange}
                            className={`border rounded p-2 w-full ${
                              errors.name ? "border-red-500" : ""
                            }`}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.name}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="email"
                            name="email"
                            value={editFormData.email}
                            onChange={handleChange}
                            className={`border rounded p-2 w-full ${
                              errors.email ? "border-red-500" : ""
                            }`}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.email}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            name="mobile"
                            value={editFormData.mobile}
                            onChange={handleChange}
                            className={`border rounded p-2 w-full ${
                              errors.mobile ? "border-red-500" : ""
                            }`}
                          />
                          {errors.mobile && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.mobile}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <img
                              src={editFormData.image}
                              alt="user Profile"
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          )}
                          <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            className="mt-2"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={handleSaveChanges}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 transition duration-150 ease-in-out">
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition duration-150 ease-in-out">
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.mobile}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={user.image}
                            alt={`${user.name}'s Profile`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4 transition duration-150 ease-in-out">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                            onClick={() => handleDeleteClick(user._id)}>
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastUser >= users.length}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastUser, users.length)}
                  </span>{" "}
                  of <span className="font-medium">{users.length}</span> results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {[
                    ...Array(Math.ceil(users.length / usersPerPage)).keys(),
                  ].map((number) => (
                    <button
                      key={number + 1}
                      onClick={() => paginate(number + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === number + 1
                          ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}>
                      {number + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastUser >= users.length}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 ml-4">
        <button
          onClick={handleGoToHome}
          className="inline-flex items-center px-4 py-2 ml-8 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition ease-in-out duration-300">
          <Home className="w-5 h-5 mr-2" />
          Go to Home
        </button>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={goToAddNewUser}
          className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out transform hover:scale-105">
          Add New User
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-end">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2 transition duration-150 ease-in-out">
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-150 ease-in-out">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
