class DocumentList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.documents = [];
    this.onDocumentSelect = null;
  }

  setDocumentSelectHandler(handler) {
    this.onDocumentSelect = handler;
  }

  async loadDocuments() {
    try {
      const response = await fetch("/documents");
      this.documents = await response.json();
      this.render();
    } catch (error) {
      console.error("Error loading documents:", error);
      this.showError("Failed to load documents");
    }
  }

  render() {
    this.container.innerHTML = `
              <h3 class="mb-4">Available Documents</h3>
              <div class="list-group">
                  ${this.documents
                    .map((doc) => this.createDocumentItem(doc))
                    .join("")}
              </div>
          `;

    // Add event listeners
    this.container.querySelectorAll(".document-item").forEach((item) => {
      item.addEventListener("click", () => {
        if (this.onDocumentSelect) {
          const docId = item.dataset.id;
          const document = this.documents.find((d) => d._id === docId);
          this.onDocumentSelect(document);
        }
      });
    });
  }

  createDocumentItem(doc) {
    return `
              <div class="document-item list-group-item list-group-item-action" data-id="${
                doc._id
              }">
                  <div class="d-flex w-100 justify-content-between">
                      <h5 class="mb-1">${this.escapeHtml(doc.fileName)}</h5>
                      <small>${this.formatDate(doc.createdAt)}</small>
                  </div>
                  <p class="mb-1">Uploaded by: ${this.escapeHtml(
                    doc.uploadedBy.email
                  )}</p>
                  <small>Current page: ${doc.currentPage}</small>
              </div>
          `;
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  }

  showError(message) {
    this.container.innerHTML = `
              <div class="alert alert-danger" role="alert">
                  ${this.escapeHtml(message)}
              </div>
          `;
  }
}
