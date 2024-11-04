import { signupService } from "../../Utils/Auth/signup"

export const signupAction = async ({request}) => {
    const formData = await request.formData()
    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')
    try {
        const data = await signupService(username, email, password)

        return { user: data}
    } catch (error) {
        return error
    }
}