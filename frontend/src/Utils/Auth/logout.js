export const logout = async () => {
    try {
        localStorage.removeItem('user');
    } catch (error) {
        return {error : `Error logging out: ${error.message}`}
    }
}