// pdfViewer.js
const socket = io();
const pdfViewer = document.getElementById("pdfCanvas");
const uploadForm = document.getElementById("uploadForm");
let pdf = null;
let currentPage = 1;

// Load PDF from a given URL
async function loadPDF(url) {
  const loadingTask = pdfjsLib.getDocument(url); // pdfjsLib should now be defined
  pdf = await loadingTask.promise;
  renderPage(currentPage);
}

// Render a specific page
async function renderPage(pageNum) {
  const page = await pdf.getPage(pageNum);
  const context = pdfViewer.getContext("2d");
  const viewport = page.getViewport({ scale: 1 });
  pdfViewer.width = viewport.width;
  pdfViewer.height = viewport.height;
  page.render({ canvasContext: context, viewport });
}

// Real-time page sync with Socket.IO
socket.on("pageChanged", (page) => {
  currentPage = page;
  renderPage(page);
});

// Handle file upload
uploadForm.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("pdf", document.getElementById("pdfFile").files[0]);

  try {
    const response = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });
    const { url } = await response.json();
    loadPDF(url);
  } catch (error) {
    console.error("Upload failed", error);
  }
};

// Navigation buttons for PDF pages
document.getElementById("prevPage").onclick = () => {
  if (currentPage > 1) socket.emit("changePage", { pageNumber: --currentPage });
};

document.getElementById("nextPage").onclick = () => {
  if (currentPage < pdf.numPages)
    socket.emit("changePage", { pageNumber: ++currentPage });
};
