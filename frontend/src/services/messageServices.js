const user = JSON.parse(localStorage.getItem('user'));
const selectedUser = JSON.parse(localStorage.getItem("selectedUser"))
export const fetchAllMessages = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/messages/groupMessage",{
          "Authorization" : `Bearer ${user.token}`
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

  const senderUiD = user.ID
  const receiverUiD = selectedUser.recipientID
  
  export const fetchPrivateChats = async () =>{
    if(!senderUiD || !receiverUiD) return
    try {
      const response =  await fetch( `http://localhost:4000/api/messages/private_chats?senderUiD=${senderUiD}&receiverUiD=${receiverUiD}`)

      const json = await response.json();
      if (!response.ok) {
        throw Error(json.error);
      }
      return json;
    } catch (error) {
      throw  Error(error.message)
    }
  }