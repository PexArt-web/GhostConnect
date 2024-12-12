import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import { clientSocket, socket } from "@/services/weBSocket";
import SharedButton from "@/shared/component/SharedButton";
import SharedDropDown from "@/shared/component/SharedDropDown";
import SharedInput from "@/shared/component/SharedInput";
import { Suspense, useEffect, useRef, useState } from "react";
import { FiSend, FiUsers } from "react-icons/fi";
import { TfiMoreAlt } from "react-icons/tfi";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import SharedDialog from "@/shared/component/SharedDialog";
import moment from "moment";
import { Await, useLoaderData, useOutletContext } from "react-router-dom";
import SuspenseFallback from "@/shared/component/SuspenseFallback";
import SharedAvatar from "@/shared/component/SharedAvatar";

const GroupChat = () => {
  requireAuth();
  const loaderElement = useLoaderData();
  // const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  // const [users, setUsers] = useState({});
  const [dataStream, setDataStream] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [messageUpdate, setMessageUpdate] = useState("");
  const messageContainerRef = useRef(null);
  const [scroll, setScroll] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const { username } = user;
  const isTypingMessage = `${username} is typing `;
  const roomName = "GhostConnect";

  let userID = localStorage.getItem("userID");
  const randomNumber = Math.floor(Math.random() * 111);
  if (!userID) {
    userID = `user-${Date.now()}-${randomNumber}`;
    localStorage.setItem("userID", userID);
  }

  const scrollToBottom = () => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  };

  if (scroll) {
    scrollToBottom();
  }
  const { users, onlineUsers } = useOutletContext();
  // console.log(onlineUsers, "context users")
  useEffect(() => {
    clientSocket();
    scrollToBottom();

    // socket.on("connect", () => {
    //   const userDetails = { id: userID, username: username };
    //   socket.emit("userDetails", userDetails);
    // });
    socket.emit("joinRoom", {roomName, userID});

    // socket.on("userRecords", ({ userCount, userList }) => {
    //   setOnlineUsersCount(userCount);
    //   setUsers(userList);
    // });

    socket.on("alertToSelf", (message) => {
      setDataStream((prev) => [...prev, { type: "alert", content: message }]);
    });

    socket.on("roomAlert", (message) => {
      setDataStream((prev) => [...prev, { type: "alert", content: message }]);
    });

    socket.on("newMessage", (messageData) => {
      console.log(messageData, "message from server");
      setDataStream((prev) => [...prev, { type: "message", ...messageData }]);
    });

    //<--update message stream-->
    socket.on("updateMessage", (messageUpdate) => {
      setDataStream((prevState) =>
        prevState.map((message) =>
          message._id === messageUpdate._id
            ? {
                ...message,
                content: messageUpdate.content,
                edited: messageUpdate.edited,
              }
            : message
        )
      );
    });
    //

    //<--Delete message stream-->
    socket.on("deletedMessage", (messageID) => {
      setDataStream((prevState) =>
        prevState.filter((state) => state._id !== messageID)
      );
    });
    //

    socket.on("focus", (data) => {
      setTypingUser(data);
    });

    socket.on("blur", (data) => {
      if (data) {
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("userRecords");
      socket.off("alertToSelf");
      socket.off("roomAlert");
      socket.off("newMessage");
      socket.off("updateMessage");
      socket.off("deleteMessage");
      socket.off("focus");
      socket.off("blur");
    };
  }, [userID, username, typingUser, setDataStream]);

  const handleSendMessage = () => {
    setTypingUser(null);
    if (!newMessage.trim()) return;
    const messageData = {
      sender: username,
      content: newMessage,
      senderID: userID,
    };
    socket.emit("roomMessage", { roomName, messageData });
    setNewMessage("");
  };

  const handleFocus = () => {
    const data = {
      roomName: roomName,
      message: isTypingMessage,
    };
    socket.emit("focus", data);
  };

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleBlur = () => {
    const data = {
      roomName: roomName,
      message: isTypingMessage,
    };
    setTypingUser(null);
    socket.emit("blur", data);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const openMessageUpdate = (item) => {
    if (!item.type === "message") return;
    setOpenDialog((prevState) => !prevState);
    setMessageUpdate(item.content);
  };

  const editMessageUpdate = (e) => {
    setMessageUpdate(e.target.value);
  };

  const handleMessageDelete = (item) => {
    const deleteID = item._id;
    socket.emit("deleteMessage", { roomName, deleteID });
  };

  const cancelUpdateMessage = () => {
    setOpenDialog((prevState) => !prevState);
  };

  const continueUpdateMessage = (item) => {
    const messageData = { messageID: item._id, message: messageUpdate };
    cancelUpdateMessage();
    socket.emit("updatedMessage", {
      roomName,
      messageData,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 shadow-lg">
        <h2 className="text-lg sm:text-xl font-semibold text-center">
          Welcome To the Invisible Connect
        </h2>
        <div className="flex items-center text-xs sm:text-sm text-gray-400">
          <FiUsers className="mr-2" />
          {onlineUsers === 1
            ? "Just You Online"
            : `${onlineUsers} members online`}
        </div>
      </div>

      {/* Online Members */}
      <div className="flex overflow-x-auto p-4 bg-gray-800 space-x-4">
        {Object.entries(users).map(([id, username]) => (
          <div
            key={id}
            className="flex flex-col items-center text-center space-y-1"
          >
            <SharedAvatar />

            <span className="text-xs sm:text-sm text-gray-300">
              {id === userID ? "You" : username}
            </span>
          </div>
        ))}
      </div>

      {/* Chat Stream */}
      <Suspense fallback={<SuspenseFallback />}>
        <Await resolve={loaderElement.getMessage}>
          {(loadedMessage) => {
            loadedMessage ? setScroll(true) : scroll;
            const messages = [...loadedMessage, ...dataStream];
            return (
              <ul
                className="flex-1 overflow-y-auto p-4 space-y-4"
                ref={messageContainerRef}
              >
                {messages.map((item, index) => (
                  <li key={index} className="mb-4">
                    {item.type === "alert" ? (
                      <div className="text-blue-400 text-center italic text-sm">
                        {item.content}
                      </div>
                    ) : (
                      <div>
                        <div
                          className={`${
                            item.senderID === userID
                              ? "text-blue-400 ml-auto"
                              : "text-green-400"
                          } font-semibold text-sm sm:text-base`}
                        >
                          {item.senderID === userID ? "You" : item.sender}
                        </div>
                        <div
                          className={`max-w-xs sm:max-w-md p-3 rounded-lg relative ${
                            item.senderID === userID
                              ? "bg-blue-600 text-white ml-auto"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {item.senderID === userID && (
                            <ul className="absolute top-2 right-2">
                              <li>
                                <SharedDropDown
                                  label={<TfiMoreAlt />}
                                  loadLabel1={"Update"}
                                  loadIcon1={<MdEdit />}
                                  loadIcon2={<FaTrash />}
                                  loadLabel2={"Delete"}
                                  handleUpdate={() => openMessageUpdate(item)}
                                  handleDelete={() => handleMessageDelete(item)}
                                />
                              </li>
                            </ul>
                          )}
                          <p className="break-words">{item.content}</p>
                          <div className="text-xs text-gray-400 italic mt-2">
                            <span className="inline-flex gap-4">
                              <span>
                                {moment(item.createdAt).format(
                                  "hh:mm A, MMM DD"
                                )}
                              </span>
                              {item.edited && (
                                <span className="text-yellow-300 ">edited</span>
                              )}
                            </span>
                            <span className="text-green-300 font-semibold float-end">
                              sent
                            </span>
                          </div>
                          <SharedDialog
                            open={openDialog}
                            title={"Edit Message"}
                            handleClose={cancelUpdateMessage}
                            sendUpdate={() => continueUpdateMessage(item)}
                            value={messageUpdate}
                            editMessage={editMessageUpdate}
                          />
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            );
          }}
        </Await>
      </Suspense>

      {/* Input Field */}
      {typingUser && (
        <p className="justify-center  flex items-center space-x-2 text-gray-600 text-md mt-2 animate-pulse italic">
          <span className="font-medium">{typingUser}</span>

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

      {/*  */}

      <div className="p-4 bg-gray-800 flex items-center space-x-2">
        <SharedInput
          type="text"
          value={newMessage}
          onChange={handleChange}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none text-sm sm:text-base"
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <SharedButton
          className="text-blue-400 text-2xl ml-2"
          handleClick={handleSendMessage}
          label={<FiSend />}
        />
      </div>
    </div>
  );
};
export default GroupChat;
