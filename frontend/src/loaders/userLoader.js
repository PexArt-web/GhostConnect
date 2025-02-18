import { requireAuth } from "@/services/Auth/middleware/requireAuth"
import { fetchFriendList, friendRequestList } from "@/services/userServices";
import { defer } from "react-router-dom";

export const friendListLoader =  () => {
    requireAuth();
    const friendList = fetchFriendList();
    return defer({ friendList });
}

export const friendRequestListLoader = () => {
    requireAuth();
    const requestList =  friendRequestList()
    return defer({ requestList });
}