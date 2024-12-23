// import { useAuthContext } from "@/hooks/useAuthContext";
import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import { clientSocket, socket } from "@/services/weBSocket";
import SharedButton from "@/shared/component/SharedButton";
import SharedDialog from "@/shared/component/SharedDialog";
import SharedDropDown from "@/shared/component/SharedDropDown";
import SharedInput from "@/shared/component/SharedInput";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FiPlusCircle, FiSend } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import { TfiMoreAlt } from "react-icons/tfi";
import { useOutletContext } from "react-router-dom";

const MainGroupChat = () => {
  requireAuth();
  const selectedUserData = JSON.parse(localStorage.getItem("selectedUser"));
  const { userID } = useOutletContext();
  // const { user } = useAuthContext()
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [messageUpdate, setMessageUpdate] = useState("");
  const [userIsTyping, setUserIsTyping] = useState(null);

  useEffect(() => {
    clientSocket();
    socket.on("connect", () => {
      console.log("Connected to websocket");
    });

    socket.on("newPrivateMessage", (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    socket.on("updatedMessage", (messageUpdate) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === messageUpdate._id
            ? {
                ...message,
                content: messageUpdate.content,
                edited: true,
              }
            : message
        )
      );
    });

    socket.on("messageDeleted", (deleteID) => {
      setMessages((prevState) =>
        prevState.filter((state) => state._id !== deleteID)
      );
    });

    socket.on("inputFocus", (data) => {
      setUserIsTyping(data);
    });

    socket.on("inputBlur", (blurData) => {
      setUserIsTyping(blurData);
    });

    return () => {
      socket.off("connect");
      socket.off("newPrivateMessage");
      socket.off("updatedMessage");
      socket.off("messageDeleted");
    };
  }, []);

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        content: newMessage,
        recipientId: selectedUserData.recipientID,
        senderID: userID,
        // authorization: `Bearer ${user.token}`
      };
      socket.emit("sendMessage", messageData);
      setNewMessage("");
    }
    setUserIsTyping(null);
  };

  const openMessageDialog = (message) => {
    setOpenDialog((prevState) => !prevState);
    setMessageUpdate(message.content);
  };

  const handleMessageDelete = (message) => {
    const data = {
      deleteID: message._id,
      recipientId: selectedUserData.recipientID,
      senderID: userID,
    };
    socket.emit("deleteTextMessage", data);
  };

  const closeMessageDialog = () => {
    setOpenDialog((prevState) => !prevState);
  };

  const editMessageUpdate = (e) => {
    setMessageUpdate(e.target.value);
  };

  const continueMessageUpdate = (message) => {
    const messageData = {
      _id: message._id,
      content: messageUpdate,
      recipientID: selectedUserData.recipientID,
      senderID: userID,
    };
    socket.emit("updateMessage", messageData);
    closeMessageDialog();
  };

  const handleFocus = () => {
    const data = {
      senderID: userID,
      recipientID: selectedUserData.recipientID,
    };
    socket.emit("inputFocus", data);
  };

  const handleBlur = () => {
    const recipientID = selectedUserData.recipientID;
    socket.emit("inputBlur", recipientID);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center p-4 bg-gray-800 shadow-lg">
        <img
          src={selectedUserData.avatar}
          alt={`${selectedUserData?.recipientName}'s avatar`}
          className="w-10 h-10 rounded-full mr-4 border-2 border-green-500"
        />
        <h2 className="text-xl font-semibold">
          {selectedUserData?.recipientName}
        </h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.senderID === userID ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`max-w-xs p-3 sm:max-w-md  rounded-lg relative ${
                message.senderID === userID
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {message.senderID === userID && (
                <ul className="absolute top-1 right-3">
                  <li>
                    <SharedDropDown
                      label={<TfiMoreAlt />}
                      loadLabel1={"Update"}
                      loadIcon1={<MdEdit />}
                      loadLabel2={"Delete"}
                      loadIcon2={<FaTrash />}
                      handleUpdate={() => openMessageDialog(message)}
                      handleDelete={() => handleMessageDelete(message)}
                    />
                  </li>
                </ul>
              )}
              <p className="break-words mt-1 "> {message.content}</p>
              <SharedDialog
                open={openDialog}
                title={"Edit Message"}
                value={messageUpdate}
                handleClose={closeMessageDialog}
                editMessage={editMessageUpdate}
                sendUpdate={() => continueMessageUpdate(message)}
              />
            </div>
          </div>
        ))}
      </div>

      {userIsTyping && (
        <p className="justify-center  flex items-center space-x-2 text-gray-600 text-md mt-2 animate-pulse italic">
          <span className="font-medium">{userIsTyping}</span>

          <span className="flex space-x-1">
            <span
              className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></span>
            <span
              className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></span>
          </span>
        </p>
      )}

      {/* Message Input Area */}
      <div className="p-4 bg-gray-800 flex items-center">
        <SharedButton
          className={"text-blue-400 text-2xl mr-2"}
          label={<FiPlusCircle />}
        />
        <SharedInput
          type={"text"}
          value={newMessage}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={"Type a message..."}
          className={
            "flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
          }
        />

        <SharedButton
          handleClick={handleSendMessage}
          className={"text-blue-400 text-2xl ml-2"}
          label={<FiSend />}
        />
      </div>
    </div>
  );
};

export default MainGroupChat;
