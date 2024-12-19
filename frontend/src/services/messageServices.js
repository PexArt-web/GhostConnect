const user = JSON.parse(localStorage.getItem('user'));
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
  