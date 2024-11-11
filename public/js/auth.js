class AuthManager {
  constructor() {
    this.currentUser = null;
    this.authListeners = new Set();
    this.initializeAuth();
  }

  async initializeAuth() {
    await this.checkAuthStatus();
    this.setupAuthButtons();
  }

  addAuthStateListener(listener) {
    this.authListeners.add(listener);
  }

  removeAuthStateListener(listener) {
    this.authListeners.delete(listener);
  }

  notifyAuthStateChange() {
    this.authListeners.forEach((listener) => listener(this.currentUser));
  }

  async checkAuthStatus() {
    try {
      const response = await fetch("/auth/status");
      const data = await response.json();

      if (data.authenticated) {
        this.currentUser = data.user;
        this.notifyAuthStateChange();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Auth status check failed:", error);
      return false;
    }
  }

  setupAuthButtons() {
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");

    if (loginBtn) {
      loginBtn.addEventListener("click", () => this.initiateGoogleLogin());
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.logout());
    }
  }

  async initiateGoogleLogin() {
    try {
      const response = await fetch("/auth/google/url");
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Failed to initiate Google login:", error);
      this.showError("Failed to initiate login. Please try again.");
    }
  }

  async logout() {
    try {
      await fetch("/auth/logout", { method: "POST" });
      this.currentUser = null;
      this.notifyAuthStateChange();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  showError(message) {
    // Implement your error display logic here
    alert(message);
  }

  // Utility method to check if user is admin
  isAdmin() {
    return this.currentUser?.isAdmin || false;
  }

  // Utility method to check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }
}
