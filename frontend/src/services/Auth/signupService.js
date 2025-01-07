export const signupService =  async (username, email, password, uniqueId) =>  {
    try {
        const response =  await fetch("http://localhost:4000/api/user/signup", { 
            method: 'POST',
            headers : { "content-type" : "application/json"} , 
            body : JSON.stringify({username, email, password, uniqueId})
        })

        const json = await response.json()
        if (!response.ok){
            throw Error (json.error)
        }
        localStorage.setItem("user", JSON.stringify(json))
        return json
    } catch (error) {
        throw Error(error)
    }
}