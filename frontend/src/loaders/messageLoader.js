import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import {
  fetchAllMessages,
  fetchPrivateChats,
} from "@/services/messageServices";
import { defer } from "react-router-dom";

export const messageLoader = () => {
  requireAuth();
  const getMessage = fetchAllMessages();
  return defer({ getMessage });
};

export const privateMessageLoader = async () => {
  const getChats = fetchPrivateChats();
  return defer({ getChats });
};
