// ===========================
// TYPING EFFECT FOR TITLE
// ===========================

const titleText = "Transform Your Images";
const titleElement = document.querySelector(".title-text");
let charIndex = 0;

function typeTitle() {
  if (charIndex < titleText.length) {
    titleElement.textContent += titleText[charIndex];
    charIndex++;
    setTimeout(typeTitle, 80);
  }
}

// Start typing effect when page loads
window.addEventListener("load", typeTitle);

// ===========================
// THEME TOGGLE FUNCTIONALITY
// ===========================

const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
const htmlElement = document.documentElement;

// Check saved theme preference
const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);

function setTheme(theme) {
  htmlElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  themeLabel.textContent = theme === "dark" ? "Dark Mode" : "Light Mode";
}

themeToggle.addEventListener("click", () => {
  const currentTheme = htmlElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
});

// ===========================
// FILTER ELEMENTS & STATE
// ===========================

const filterElements = {
  brightness: document.getElementById("brightness"),
  contrast: document.getElementById("contrast"),
  saturate: document.getElementById("saturate"),
  blur: document.getElementById("blur"),
  grayscale: document.getElementById("grayscale"),
  sepia: document.getElementById("sepia"),
  hueRotate: document.getElementById("hueRotate"),
};

const valueDisplays = {
  brightness: document.getElementById("brightnessValue"),
  contrast: document.getElementById("contrastValue"),
  saturate: document.getElementById("saturateValue"),
  blur: document.getElementById("blurValue"),
  grayscale: document.getElementById("grayscaleValue"),
  sepia: document.getElementById("sepiaValue"),
  hueRotate: document.getElementById("hueRotateValue"),
};

const uploadArea = document.getElementById("uploadArea");
const imageUpload = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const loadingAnimation = document.getElementById("loadingAnimation");

const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");

let originalImageLoaded = false;

// ===========================
// IMAGE UPLOAD HANDLING
// ===========================

// Click to upload
uploadArea.addEventListener("click", () => imageUpload.click());

// Drag and drop
uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("drag-over");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("drag-over");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("drag-over");
  handleImageUpload(e.dataTransfer.files[0]);
});

// File input change
imageUpload.addEventListener("change", (e) => {
  if (e.target.files[0]) {
    handleImageUpload(e.target.files[0]);
  }
});

function handleImageUpload(file) {
  if (!file.type.startsWith("image/")) {
    alert("Please upload an image file");
    return;
  }

  // Show loading animation
  uploadPlaceholder.style.display = "none";
  previewImage.style.display = "none";
  loadingAnimation.style.display = "flex";

  // Simulate processing with timeout
  setTimeout(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewImage.style.display = "block";
      loadingAnimation.style.display = "none";
      originalImageLoaded = true;

      // Enable buttons
      downloadBtn.disabled = false;
      resetBtn.disabled = false;

      // Reset filters
      resetFilters();
    };
    reader.readAsDataURL(file);
  }, 800);
}

// ===========================
// FILTER MANAGEMENT
// ===========================

function updateFilterValues() {
  // Update display values
  valueDisplays.brightness.textContent = filterElements.brightness.value;
  valueDisplays.contrast.textContent = filterElements.contrast.value;
  valueDisplays.saturate.textContent = filterElements.saturate.value;
  valueDisplays.blur.textContent = filterElements.blur.value;
  valueDisplays.grayscale.textContent = Math.round(
    filterElements.grayscale.value,
  );
  valueDisplays.sepia.textContent = Math.round(filterElements.sepia.value);
  valueDisplays.hueRotate.textContent = filterElements.hueRotate.value + "°";

  // Update slider fills
  updateSliderFills();

  // Apply filters to image
  if (originalImageLoaded) {
    applyFilters();
  }
}

function updateSliderFills() {
  Object.keys(filterElements).forEach((filter) => {
    const slider = filterElements[filter];
    const track = slider.closest(".slider-track");
    if (track) {
      const fill = track.querySelector(".slider-fill");
      const max = slider.max;
      const value = slider.value;
      const percentage = (value / max) * 100;
      fill.style.width = percentage + "%";
    }
  });
}

function applyFilters() {
  if (!previewImage.src) return;

  const brightness = filterElements.brightness.value;
  const contrast = filterElements.contrast.value;
  const saturate = filterElements.saturate.value;
  const blur = filterElements.blur.value;
  const grayscale = filterElements.grayscale.value;
  const sepia = filterElements.sepia.value;
  const hueRotate = filterElements.hueRotate.value;

  previewImage.style.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturate}%)
        blur(${blur}px)
        grayscale(${grayscale}%)
        sepia(${sepia}%)
        hue-rotate(${hueRotate}deg)
    `;
}

// Add event listeners to all filter sliders
Object.values(filterElements).forEach((slider) => {
  slider.addEventListener("input", updateFilterValues);
});

// ===========================
// RESET FILTERS
// ===========================

function resetFilters() {
  filterElements.brightness.value = 100;
  filterElements.contrast.value = 100;
  filterElements.saturate.value = 100;
  filterElements.blur.value = 0;
  filterElements.grayscale.value = 0;
  filterElements.sepia.value = 0;
  filterElements.hueRotate.value = 0;

  updateFilterValues();
}

resetBtn.addEventListener("click", () => {
  resetFilters();
  previewImage.style.filter = "";
  updateFilterValues();
});

// ===========================
// DOWNLOAD FUNCTIONALITY
// ===========================

downloadBtn.addEventListener("click", () => {
  if (!originalImageLoaded) return;

  // Show loading during download
  const originalText = downloadBtn.innerHTML;
  downloadBtn.innerHTML = "<span>⏳</span> Processing...";
  downloadBtn.disabled = true;

  setTimeout(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Create a temporary image to get original dimensions
    const tempImg = new Image();
    tempImg.onload = () => {
      canvas.width = tempImg.width;
      canvas.height = tempImg.height;

      // Apply filters to canvas context
      ctx.filter = `
                brightness(${filterElements.brightness.value}%)
                contrast(${filterElements.contrast.value}%)
                saturate(${filterElements.saturate.value}%)
                blur(${filterElements.blur.value}px)
                grayscale(${filterElements.grayscale.value}%)
                sepia(${filterElements.sepia.value}%)
                hue-rotate(${filterElements.hueRotate.value}deg)
            `;

      ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);

      // Download the image
      const link = document.createElement("a");
      link.download = "SILYA-filtered-image.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      // Restore button state
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    };
    tempImg.src = previewImage.src;
  }, 600);
});

// ===========================
// INITIALIZATION
// ===========================

// Set initial slider fills
window.addEventListener("load", () => {
  updateSliderFills();
});
