(function () {
  const STORAGE_KEY = "plc.siteAnnouncement.mainChapterNinePreRelease.v1";
  const title = "曲池公告";
  const message =
    "两首主线九先行曲更新时间未知，将被暂时移出PLC正赛曲池，如开赛日前一天未正式更新，则将不再进入PLC正赛曲池。";

  function hasSeenAnnouncement() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "seen";
    } catch (error) {
      return false;
    }
  }

  function markAnnouncementSeen() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "seen");
    } catch (error) {
      // Ignore private-mode storage errors.
    }
  }

  function closeAnnouncement(root) {
    root.classList.add("is-closing");
    markAnnouncementSeen();
    window.setTimeout(() => {
      root.remove();
      document.body.classList.remove("site-announcement-open");
    }, 180);
  }

  function showAnnouncement() {
    const root = document.createElement("div");
    root.className = "site-announcement";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "siteAnnouncementTitle");
    root.innerHTML = `
      <div class="site-announcement-backdrop" data-site-announcement-close></div>
      <section class="site-announcement-panel">
        <p>PLC NOTICE</p>
        <h2 id="siteAnnouncementTitle">${title}</h2>
        <div class="site-announcement-message">${message}</div>
        <button class="site-announcement-action" type="button" data-site-announcement-close>我知道了</button>
      </section>
    `;

    function requestClose() {
      document.removeEventListener("keydown", handleKeydown);
      closeAnnouncement(root);
    }

    function handleKeydown(event) {
      if (event.key === "Escape" && document.body.contains(root)) {
        requestClose();
      }
    }

    root.addEventListener("click", (event) => {
      if (event.target.closest("[data-site-announcement-close]")) {
        requestClose();
      }
    });

    document.addEventListener("keydown", handleKeydown);

    document.body.appendChild(root);
    document.body.classList.add("site-announcement-open");
    root.querySelector(".site-announcement-action")?.focus({
      preventScroll: true
    });
  }

  if (hasSeenAnnouncement()) {
    return;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showAnnouncement, {
      once: true
    });
  } else {
    showAnnouncement();
  }
})();
