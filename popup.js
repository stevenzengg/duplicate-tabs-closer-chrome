document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggle");

  chrome.storage.local.get("enabled", (data) => {
    toggle.checked = data.enabled !== false;
  });

  toggle.addEventListener("change", () => {
    chrome.runtime.sendMessage({ toggle: toggle.checked }, (response) => {
      if (!response.success) {
        console.error("Failed to update toggle state.");
      }
    });
  });
});