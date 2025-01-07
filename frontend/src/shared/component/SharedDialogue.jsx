import { TfiClose } from "react-icons/tfi";
import SharedInput from "./SharedInput";
import SharedButton from "./SharedButton";
import { FiSend } from "react-icons/fi";

const SharedDialogue = ({ isVisible, onClose, handleUpdate, data, handleEditor }) => {
  if (!isVisible) return null;

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-900 bg-opacity-50 fixed inset-0 z-50"
      aria-modal="true"
      role="dialog"
      key={data?.id}
    >
      <div className="bg-white border border-gray-300 rounded-lg p-6 w-[90%] max-w-[700px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Edit Text</h1>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="text-gray-600 hover:text-white hover:bg-red-600 p-1 rounded transition-colors duration-200"
          >
            <TfiClose size={20} />
          </button>
        </div>
        <hr className="my-4" />

        {/* Text Editor */}
        <div>
          <SharedInput
            placeholder="Modify Your Text..."
            className={"text-black"}
            value={data?.content}
            onChange={handleEditor}
          />
        </div>
        <hr className="my-4" />

        {/* Footer */}
        <div className="flex justify-end space-x-2">
          <SharedButton
            label={<FiSend />}
            className="p-2 bg-gray-900 text-white rounded"
            handleClick={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default SharedDialogue;
