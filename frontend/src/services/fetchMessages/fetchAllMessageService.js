export const fetchAllMessages = async () => {
  try {
    const response = await fetch(
      "http://localhost:4000/api/messsages/groupMessage"
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
