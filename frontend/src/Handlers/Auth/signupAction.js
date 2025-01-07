import { signupService } from "../../services/Auth/signupService";
import { signUpSchema } from "../Schemas/signUpSchema";
import {v4 as uuidv4} from "uuid"

export const signupAction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const uniqueId = uuidv4()
  try {
    signUpSchema.parse({ username, email, password });
    if (!username || !email || !password) {
      throw Error("All fields are required front");
    }
    const data = await signupService(username, email, password, uniqueId);
    return { user: data };
  } catch (error) {
    // error.message = "TypeError: Failed to fetch"
    //   ? (error.message =
    //       "Network error: Unable to connect. Please check your internet connection and try again.")
    //   : error.message;
    return { error: error.message };
  }
};
