// public/js/app.js
class App {
  constructor() {
    this.documentList = new DocumentList("documents-list");
    this.uploadManager = new UploadManager("upload-form");
    this.pdfViewer = new PDFViewer("pdf-viewer");
    this.initializeApp();
  }

  async initializeApp() {
    // Set up handlers
    this.documentList.setDocumentSelectHandler(
      this.handleDocumentSelect.bind(this)
    );
    this.uploadManager.setUploadSuccessHandler(
      this.handleUploadSuccess.bind(this)
    );

    // Check authentication status
    await this.checkAuth();

    // Load initial documents
    await this.documentList.loadDocuments();
  }

  async checkAuth() {
    try {
      const response = await fetch("/auth/status");
      const data = await response.json();

      if (data.authenticated) {
        this.handleAuthentication(data);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  }

  handleAuthentication(userData) {
    document.getElementById("upload-section").style.display = userData.isAdmin
      ? "block"
      : "none";
    document.getElementById("login-btn").style.display = "none";
  }

  handleDocumentSelect(document) {
    this.pdfViewer.loadDocument(document);
  }

  handleUploadSuccess(data) {
    this.documentList.loadDocuments();
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
