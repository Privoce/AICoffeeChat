const PLATFORM_LABELS = {
  tiktok: "TikTok",
  instagram: "Instagram",
};

function formatDate(iso) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function populateContentFilters() {
  const topicSelect = document.getElementById("filter-topic");
  const studySelect = document.getElementById("filter-study");

  uniqueSorted(window.VIDEO_POSTS.map((v) => v.topic)).forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    topicSelect.appendChild(option);
  });

  uniqueSorted(window.VIDEO_POSTS.map((v) => v.areaOfStudy)).forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    studySelect.appendChild(option);
  });
}

function getFilteredVideos() {
  const query = document.getElementById("search-title").value.trim().toLowerCase();
  const topic = document.getElementById("filter-topic").value;
  const study = document.getElementById("filter-study").value;
  const sort = document.getElementById("filter-sort").value;

  let videos = window.VIDEO_POSTS.filter((video) => {
    if (topic && video.topic !== topic) return false;
    if (study && video.areaOfStudy !== study) return false;
    if (query && !video.title.toLowerCase().includes(query)) return false;
    return true;
  });

  videos.sort((a, b) => {
    const diff = new Date(b.publishedAt) - new Date(a.publishedAt);
    return sort === "oldest" ? -diff : diff;
  });

  return videos;
}

function platformIcon(platform) {
  if (platform === "tiktok") {
    return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>`;
  }
  return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`;
}

function renderVideoCard(video) {
  const platformLabel = PLATFORM_LABELS[video.platform];

  return `
    <article class="video-card">
      <button type="button" class="video-card-media" data-video-id="${video.id}" aria-label="Watch ${video.title}">
        <img src="${video.thumbnail}" alt="" loading="lazy" />
        <div class="video-card-overlay">
          <span class="platform-badge platform-badge--${video.platform}">
            ${platformIcon(video.platform)}
            ${platformLabel}
          </span>
          <span class="play-btn" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </span>
        </div>
      </button>
      <div class="video-card-body">
        <h2>${video.title}</h2>
        <p>${video.snippet}</p>
        <button type="button" class="watch-btn" data-video-id="${video.id}">
          Watch video
        </button>
      </div>
    </article>
  `;
}

function openVideoModal(videoId) {
  const video = window.VIDEO_POSTS.find((v) => v.id === videoId);
  if (!video) return;

  const modal = document.getElementById("video-modal");
  const player = document.getElementById("modal-video");
  const platformLabel = PLATFORM_LABELS[video.platform];

  document.getElementById("modal-title").textContent = video.title;
  document.getElementById("modal-snippet").textContent = video.snippet;
  document.getElementById("modal-date").textContent = formatDate(video.publishedAt);

  const platformBadge = document.getElementById("modal-platform");
  platformBadge.className = `platform-badge platform-badge--${video.platform}`;
  platformBadge.innerHTML = `${platformIcon(video.platform)} Reposted from ${platformLabel}`;

  const external = document.getElementById("modal-external");
  external.href = video.externalUrl;
  document.getElementById("modal-platform-name").textContent = platformLabel;

  player.poster = video.thumbnail;
  player.src = video.videoSrc;

  modal.hidden = false;
  document.body.style.overflow = "hidden";
  player.play().catch(() => {});
}

function closeVideoModal() {
  const modal = document.getElementById("video-modal");
  const player = document.getElementById("modal-video");

  player.pause();
  player.removeAttribute("src");
  player.load();
  modal.hidden = true;
  document.body.style.overflow = "";
}

function render() {
  const videos = getFilteredVideos();
  const grid = document.getElementById("video-grid");
  const empty = document.getElementById("empty-state");
  const resultsCount = document.getElementById("results-count");
  const clearBtn = document.getElementById("clear-filters");

  const hasFilters =
    document.getElementById("search-title").value.trim() ||
    document.getElementById("filter-topic").value ||
    document.getElementById("filter-study").value;

  clearBtn.hidden = !hasFilters;
  resultsCount.textContent =
    videos.length === window.VIDEO_POSTS.length
      ? `Showing all ${videos.length} reposted videos`
      : `${videos.length} video${videos.length === 1 ? "" : "s"} match your filters`;

  if (videos.length === 0) {
    grid.innerHTML = "";
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  grid.innerHTML = videos.map(renderVideoCard).join("");

  grid.querySelectorAll(".video-card-media, .watch-btn").forEach((el) => {
    el.addEventListener("click", () => openVideoModal(el.dataset.videoId));
  });
}

function clearFilters() {
  document.getElementById("search-title").value = "";
  document.getElementById("filter-topic").value = "";
  document.getElementById("filter-study").value = "";
  document.getElementById("filter-sort").value = "newest";
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  populateContentFilters();
  render();

  document.getElementById("search-title").addEventListener("input", render);
  ["filter-topic", "filter-study", "filter-sort"].forEach((id) => {
    document.getElementById(id).addEventListener("change", render);
  });
  document.getElementById("clear-filters").addEventListener("click", clearFilters);

  document.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closeVideoModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !document.getElementById("video-modal").hidden) {
      closeVideoModal();
    }
  });
});
