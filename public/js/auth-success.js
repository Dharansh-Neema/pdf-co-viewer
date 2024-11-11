document.addEventListener("DOMContentLoaded", () => {
  const authManager = new AuthManager();

  // Check if this is a redirect from successful authentication
  if (window.location.pathname === "/auth-success") {
    authManager.checkAuthStatus().then((success) => {
      if (success) {
        window.location.href = "/"; // Redirect to main page
      }
    });
  }
});
