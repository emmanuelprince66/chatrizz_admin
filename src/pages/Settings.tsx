import { CustomCard } from "@/components/app/CustomCard";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const handleAdminManagement = () => {
    navigate("/settings/admin-management");
  };

  const handleResetPassword = () => {
    navigate("/settings/reset-password");
  };

  return (
    <div className="min-h-screen  p-4 md:p-6 lg:p-8">
      <div className=" mx-auto">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-[500] text-gray-900 mb-2">
            Settings & Permissions
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account settings and administrative permissions
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Admin Management Card */}
          <div onClick={handleAdminManagement} className="group cursor-pointer">
            <CustomCard
              title="Admin Management"
              description="Administrators"
              className="transition-all duration-300 hover:shadow-lg hover:scale-105 p-4 hover:border-[#0892D0] border-2 border-transparent"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mt-1">
                    Manage admin users and their permissions
                  </p>
                </div>
                <div className="ml-4">
                  <div className="w-10 h-10 bg-[#0892D0] bg-opacity-10 rounded-full flex items-center justify-center group-hover:bg-opacity-20 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </CustomCard>
          </div>

          {/* Reset Password Card */}
          <div onClick={handleResetPassword} className="group cursor-pointer">
            <CustomCard
              title="Reset Password"
              description="Update your password"
              className="transition-all duration-300 hover:shadow-lg p-4 hover:scale-105 hover:border-[#0892D0] border-2 border-transparent"
              bgColor="bg-white"
              headerClassName="pb-2"
              contentClassName="pt-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mt-1">
                    Change your current password for better security
                  </p>
                </div>
                <div className="ml-4">
                  <div className="w-10 h-10 bg-[#0892D0] bg-opacity-10 rounded-full flex items-center justify-center group-hover:bg-opacity-20 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </CustomCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
