export const logoutService = async () => {
    try {
       localStorage.removeItem('user');
       localStorage.removeItem('userID');
       localStorage.removeItem('selectedUser');
    } catch (error) {
        return {error : `Error logging out: ${error.message}`}
    }
}