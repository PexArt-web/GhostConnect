export const fetchAllMessages = async () => {
  try {
    const user = await JSON.parse(localStorage.getItem("user"));
    const response = await fetch(
      "http://localhost:4000/api/messages/groupMessage",
      {
        Authorization: `Bearer ${user.token}`,
      }
    );
    const json = await response.json();
    if (!response.ok) {
      throw Error(json.error);
    }
    return json;
  } catch (error) {
    throw Error(error);
  }
};

export const fetchPrivateChats = async () => {
  try {
    const user = await JSON.parse(localStorage.getItem("user"));
    const selectedUser = await JSON.parse(localStorage.getItem("selectedUser"));
    const senderUiD = user?.ID;
    const receiverUiD = selectedUser?.recipientID;
    if (!senderUiD || !receiverUiD) return;
    const response = await fetch(
      `http://localhost:4000/api/messages/private_chats?senderUiD=${senderUiD}&receiverUiD=${receiverUiD}`
    );

    const json = await response.json();
    if (!response.ok) {
      throw Error(json.error);
    }
    return json;
  } catch (error) {
    throw Error(error.message);
  }
};
