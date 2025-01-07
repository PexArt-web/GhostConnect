import { useAuthContext } from "@/hooks/useAuthContext";
import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import { clientSocket, socket } from "@/services/weBSocket";
import SharedButton from "@/shared/component/SharedButton";
import SharedDialogue from "@/shared/component/SharedDialogue";
import ComboboxDropdownMenu from "@/shared/component/SharedDropdownMenu";
import SharedInput from "@/shared/component/SharedInput";
import SuspenseFallback from "@/shared/component/SuspenseFallback";
import { Suspense, useEffect, useRef, useState } from "react";
import { FiPlusCircle, FiSend } from "react-icons/fi";
import { Await, useLoaderData, useOutletContext } from "react-router-dom";

const MainGroupChat = () => {
  requireAuth();
  const dataElement = useLoaderData();
  const selectedUserData = JSON.parse(localStorage.getItem("selectedUser"));
  const { userID } = useOutletContext();
  const { user } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [updatedText, setUpdatedText] = useState(null);
  const [userIsTyping, setUserIsTyping] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [scroll, setScroll] = useState(false);
  const messageContainerRef = useRef(null);
  const scrollToBottom = () => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  };
  if (scroll) {
    scrollToBottom();
  }

  useEffect(() => {
    clientSocket();
    scrollToBottom();
    socket.on("connect", () => {
      setActive(true);
      console.log("Connected to websocket");
    });

    socket.on("newPrivateMessage", (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    socket.on("updatedMessage", (messageUpdate) => {
      console.log(messageUpdate, "updated message");
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
        senderID: user.ID,
        // authorization: `Bearer ${user.token}`
      };
      socket.emit("sendMessage", messageData);
      setNewMessage("");
    }
    setUserIsTyping(null);
  };

  const handleMessageDelete = (message) => {
    const data = {
      deleteID: message._id,
      recipientId: selectedUserData.recipientID,
      senderID: user.ID,
    };
    socket.emit("deleteTextMessage", data);
  };

  const handleFocus = () => {
    const data = {
      senderID: user.ID,
      recipientID: selectedUserData.recipientID,
    };
    socket.emit("inputFocus", data);
  };

  const handleBlur = () => {
    const recipientID = selectedUserData.recipientID;
    socket.emit("inputBlur", recipientID);
  };

  const update = () => {
    if (!updatedText) return;
    alert(updatedText._id);
    const messageData = {
      _id: updatedText._id,
      content: updatedText.content,
      recipientID: selectedUserData.recipientID,
      senderID: user.ID,
    };
    socket.emit("updateMessage", messageData);
    setUpdatedText(null);
    setModalVisible(false);
  };

  const handleEdit = (e) => {
    setUpdatedText((prevState) => ({
      ...prevState,
      content: e.target.value,
    }));
  };

  const controller = (message) => {
    setModalVisible(true);
    setUpdatedText(message);
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

        <div>
          <h2 className="text-xl font-semibold">
            {selectedUserData?.recipientName}
          </h2>
          <div className="flex items-center space-x-2">
            <span
              className={`w-3 h-3 rounded-full ${
                active ? "bg-green-500" : "bg-gray-500"
              }`}
            ></span>
            <span
              className={`text-sm font-medium ${
                active ? "text-green-400" : "text-gray-400"
              }`}
            >
              {active ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4" ref={messageContainerRef}>
        <Suspense fallback={<SuspenseFallback />}>
          <Await resolve={dataElement.getChats}>
            {(resolvedData) => {
              resolvedData ? setScroll(true) : scroll;
              const chatMessages = [...resolvedData, ...messages];
              return chatMessages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.senderID === userID
                      ? "justify-end"
                      : "justify-start"
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
                      <ul className="absolute top-0 right-1">
                        <li>
                          <ComboboxDropdownMenu
                            handleClick={() => controller(message)}
                            handleDelete={() => handleMessageDelete(message)}
                          />
                        </li>
                      </ul>
                    )}

                    <p className="break-words mt-1 "> {message.content}</p>
                  </div>
                </div>
              ));
            }}
          </Await>
        </Suspense>
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
      <div>
        <SharedDialogue
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          handleUpdate={() => update()}
          data={updatedText}
          handleEditor={handleEdit}
        />
      </div>
      <div className="p-4 bg-gray-800 flex items-center">
        <SharedButton
          className={"text-blue-400 text-2xl mr-2"}
          label={<FiPlusCircle />}
        />
        <SharedInput
          type={"text"}
          v
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
