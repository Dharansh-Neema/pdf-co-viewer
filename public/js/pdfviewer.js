let pdfDoc = null;
let pageNum = 1;
const scale = 1.5;

async function loadPDF(url) {
  try {
    const loadingTask = pdfjsLib.getDocument(url);
    pdfDoc = await loadingTask.promise;
    document.getElementById("controls").style.display = "block";
    renderPage(pageNum);
  } catch (error) {
    console.error("Error loading PDF:", error);
  }
}

async function renderPage(num) {
  const page = await pdfDoc.getPage(num);
  const canvas = document.getElementById("pdf-canvas");
  const ctx = canvas.getContext("2d");

  const viewport = page.getViewport({ scale });
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({
    canvasContext: ctx,
    viewport: viewport,
  }).promise;

  document.getElementById("page-num").textContent = `Page: ${num}`;
}

async function loadDocuments() {
  try {
    const response = await fetch("/documents");
    const documents = await response.json();

    const documentsListEl = document.getElementById("documents-list");
    documentsListEl.innerHTML = documents
      .map(
        (doc) => `
            <div class="document-item" data-id="${doc._id}">
                <h5>${doc.fileName}</h5>
                <small>Uploaded by: ${doc.uploadedBy.email}</small>
            </div>
        `
      )
      .join("");

    documentsListEl.addEventListener("click", (e) => {
      const documentItem = e.target.closest(".document-item");
      if (documentItem) {
        const documentId = documentItem.dataset.id;
        initPdfViewer(documentId);
      }
    });
  } catch (error) {
    console.error("Error loading documents:", error);
  }
}

document
  .getElementById("upload-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("pdf", document.getElementById("pdf-file").files[0]);

    try {
      const response = await fetch("/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { documentId } = await response.json();
        loadDocuments();
        initPdfViewer(documentId);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  });

// Navigation controls
document.getElementById("prev-page").addEventListener("click", () => {
  if (pageNum > 1) {
    pageNum--;
    if (currentUser?.isAdmin) {
      socket.emit("change-page", {
        documentId: currentDocumentId,
        page: pageNum,
        isAdmin: true,
      });
    }
    renderPage(pageNum);
  }
});

document.getElementById("next-page").addEventListener("click", () => {
  if (pdfDoc && pageNum < pdfDoc.numPages) {
    pageNum++;
    if (currentUser?.isAdmin) {
      socket.emit("change-page", {
        documentId: currentDocumentId,
        page: pageNum,
        isAdmin: true,
      });
    }
    renderPage(pageNum);
  }
});
