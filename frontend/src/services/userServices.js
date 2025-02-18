export const friendRequestList = async () => {
  // Fetching the friend request list from the database
  try {
    const response = await fetch(
      `http://localhost:4000/api/user/friendRequestList`
    );

    if (!response.ok) {
      throw Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw Error(error.message);
  }
};

export const fetchFriendList = async () => {
  // Fetching the friend list from the database
  try {
    const response = await fetch(`http://localhost:4000/api/user/friendList`);
    const json = await response.json();
    if (!response.ok) {
      throw Error(`HTTP error! status: ${response.status}`);
    }
    return json
  } catch (error) {
    throw Error(error.message);
  }
};
