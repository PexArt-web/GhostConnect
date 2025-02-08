import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { IoClose } from "react-icons/io5";
import SharedButton from "./SharedButton";

const SharedAlert = ({ title, label, className, button, openNotification, onClose, acceptRequest, declineRequest }) => {
  if (!openNotification) return null;

  return (
    <div className={`${className}`}>
      <Alert
        className={`relative flex flex-col items-center p-4 space-y-4 rounded-lg border border-gray-200 shadow-md bg-white mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg ${className}`}
      >
        {/* Close Icon */}
        <SharedButton
        handleClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        label={ <IoClose className="w-5 h-5" />}
        />
  

        <div className="flex items-center justify-center text-green-500">
          <Terminal className="h-6 w-6" />
        </div>

        <div className="text-center space-y-2">
          <AlertTitle className="text-lg font-semibold text-gray-800">
            {title}
          </AlertTitle>

          <AlertDescription className="text-sm text-gray-600">
            {label}
          </AlertDescription>
        </div>

        <div
          className={`flex items-center justify-center space-x-4 ${
            button ? "block" : "hidden"
          }`}
        >
          <SharedButton
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            label={"Accept"}
            handleClick={acceptRequest}
          />
          <SharedButton
            className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 hover:bg-red-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:outline-none"
            label={"Decline"}
            handleClick={declineRequest}
          />
        </div>
      </Alert>
    </div>
  );
};

export default SharedAlert;
