import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../Redux/AdminSlice";
import axiosInstance from "../../utils/AxiosConfig";

function Home() {
  const adminData = useSelector((state) => state.admin.adminDatas);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAdminLogout = async () => {
    dispatch(logoutAdmin());
    const response = await axiosInstance.patch("/admin/adminLogout");
    if (response.data.success) {
      navigate("/admin/login");
    }
  };

  const handleDashboard = () => {
    navigate("/admin/dashboard");
  };
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Admin Home
        </h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full divide-x divide-gray-200">
              <tbody>
                <tr className="divide-x divide-gray-200">
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-lg font-medium text-gray-900 mb-2 text-center">
                      Name
                    </div>
                    <div className="text-base text-gray-700 text-center">
                      {adminData?.name || "No admin name available"}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-lg font-medium text-gray-900 mb-2 text-center">
                      Email
                    </div>
                    <div className="text-base text-gray-700 text-center">
                      {adminData?.email || "No admin email available"}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-lg font-medium text-gray-900 mb-2 text-center">
                      Phone Number
                    </div>
                    <div className="text-base text-gray-700 text-center">
                      {adminData?.mobile || "No admin phone number available"}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleAdminLogout}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300">
            Logout
          </button>
          <button
            onClick={handleDashboard}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300">
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
