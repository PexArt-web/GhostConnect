export const requireAuth = async (request) => {
  // const pathname = new URL(request?.url)?.pathname || "/login";
  const user = localStorage.getItem("user");
  if (!user) {
    // window.location.href = `/login?message=You must be logged in.&redirectTo=${pathname}`;
    window.location.href = `/login?message=You must be logged in.`;
  }
};
