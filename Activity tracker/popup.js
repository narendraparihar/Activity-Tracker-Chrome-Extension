document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("timeSpent", (data) => {
    const timeSpent = data.timeSpent || {};
    const container = document.getElementById("time-spent");
    container.innerHTML = "";

    if (Object.keys(timeSpent).length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.textContent = "No data available.";
      emptyMessage.className = "empty-message";
      container.appendChild(emptyMessage);
    } else {
      Object.keys(timeSpent).forEach((url) => {
        const duration = timeSpent[url];
        const formattedTime = formatDuration(duration);
        const item = document.createElement("div");
        item.className = "time-spent-item";
        const icon = getIconForUrl(url);
        item.innerHTML = `
            <div class="url">${icon} ${url}</div>
            <div class="duration">${formattedTime}</div>
          `;
        container.appendChild(item);
      });
    }
  });
});

function formatDuration(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  return `${hours}h ${minutes}m ${seconds}s`;
}

function getIconForUrl(url) {
  if (url.includes("youtube.com")) {
    return '<i class="fab fa-youtube"></i>';
  } else if (url.includes("facebook.com")) {
    return '<i class="fab fa-facebook"></i>';
  } else if (url.includes("instagram.com")) {
    return '<i class="fab fa-instagram"></i>';
  } else if (url.includes("reddit.com")) {
    return '<i class="fab fa-reddit"></i>';
  } else {
    return '<i class="fas fa-globe"></i>';
  }
}
