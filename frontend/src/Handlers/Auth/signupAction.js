import { signupService } from "../../Utils/Auth/signupService";

export const signupAction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  console.log(username, email, password, "formData: sign" + formData);
  try {
    const data = await signupService(username, email, password);

    return { user: data };
  } catch (error) {
    return { error: error.message };
  }
};
