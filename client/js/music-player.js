(function () {
  const tracks = [
    {
      name: "A-39, 沙包P, 初音ミク - WATER(Feat.Miku)",
      fileName: "A-39, 沙包P, 初音ミク - WATER(Feat.Miku).mp3",
      lyricFileName: "A-39,沙包P,初音ミク - WATER(Feat.Miku).lrc"
    },
    {
      name: "AiSS, Daily天利, A-39, 沙包P, 水东合电研 - 雪降り ~雪が降っている~",
      fileName: "AiSS, Daily天利, A-39, 沙包P, 水东合电研 - 雪降り ~雪が降っている~.mp3",
      lyricFileName: "AiSS,Daily天利,A-39 - 雪降り ~雪が降っている~.lrc"
    },
    {
      name: "Halv - Khronostasis Katharsis",
      fileName: "Halv - Khronostasis Katharsis.mp3"
    },
    {
      name: "HyuN - Infinity Heaven",
      fileName: "HyuN - Infinity Heaven.mp3"
    },
    {
      name: "kuro - a truth seeker -Communication with Utopia will be lost-",
      fileName: "kuro - a truth seeker -Communication with Utopia will be lost-.mp3"
    },
    {
      name: "Laur - PRAGMATISM -RESURRECTION-",
      fileName: "Laur - PRAGMATISM -RESURRECTION-.mp3"
    },
    {
      name: "LeaF - Lyrith -迷宮リリス-",
      fileName: "LeaF - Lyrith -迷宮リリス-.mp3"
    },
    {
      name: "M2U,Pica - 神話",
      fileName: "M2U,Pica - 神話.mp3"
    },
    {
      name: "Nhato - Radiance",
      fileName: "Nhato - Radiance.mp3"
    },
    {
      name: "seatrus - 零號車輛",
      fileName: "seatrus - 零號車輛.mp3"
    },
    {
      name: "Team Grimoire - Rrhar'il",
      fileName: "Team Grimoire - Rrhar'il.mp3"
    },
    {
      name: "Xomu - Mannenzakura",
      fileName: "Xomu - Mannenzakura.mp3"
    },
    {
      name: "彭柏德 - 夏·星",
      fileName: "彭柏德 - 夏·星.mp3"
    },
    {
      name: "符白牙, lunari.io - 云女孩",
      fileName: "符白牙, lunari.io - 云女孩.mp3"
    },
    {
      name: "米虾Fomiki,初云CLoudie,卉HUI-Works - Luminescence",
      fileName: "米虾Fomiki,初云CLoudie,卉HUI-Works - Luminescence.mp3"
    },
    {
      name: "辻原 - 宇宙残骸少女",
      fileName: "辻原 - 宇宙残骸少女.mp3",
      lyricFileName: "辻原 - 宇宙残骸少女.lrc"
    },
    {
      name: "邱有句 - 云村的告别",
      fileName: "邱有句 - 云村的告别.mp3"
    },
    {
      name: "邱有句, 邹牧虞 - 腐草为萤",
      fileName: "邱有句, 邹牧虞 - 腐草为萤.mp3"
    }
  ];

  const lyricCache = new Map();
  const volume = 0.1;
  const mobileAudioDir = "./assets/music-mobile/";

  function getAssetSrc(fileName) {
    return `./assets/${encodeURIComponent(fileName)}`;
  }

  function shouldUseMobileAudio() {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    const effectiveType = connection?.effectiveType || "";
    const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;
    const isCompactViewport = window.matchMedia("(max-width: 1024px)").matches;
    const isSmallTouchDevice =
      isCompactViewport &&
      window.matchMedia("(pointer: coarse)").matches;
    const isSlowNetwork = ["slow-2g", "2g", "3g"].includes(effectiveType);
    const prefersLightAudio = isCompactViewport && (connection?.saveData || isSlowNetwork);

    return Boolean(isMobileViewport || isSmallTouchDevice || prefersLightAudio);
  }

  function getAudioSrc(fileName) {
    const baseDir = shouldUseMobileAudio() ? mobileAudioDir : "./assets/";
    return `${baseDir}${encodeURIComponent(fileName)}`;
  }

  function pickRandomIndex(exceptIndex = -1) {
    if (tracks.length <= 1) {
      return 0;
    }

    let nextIndex = exceptIndex;

    while (nextIndex === exceptIndex) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    }

    return nextIndex;
  }

  function parseTimestamp(minutes, seconds, fraction = "") {
    const normalizedFraction = String(fraction || "").padEnd(3, "0").slice(0, 3);
    return Number(minutes) * 60 + Number(seconds) + Number(normalizedFraction) / 1000;
  }

  function parseLyricLine(line) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      return [];
    }

    if (trimmedLine.startsWith("{")) {
      try {
        const payload = JSON.parse(trimmedLine);
        const text = Array.isArray(payload.c)
          ? payload.c.map((item) => item.tx || "").join("").trim()
          : "";

        return Number.isFinite(payload.t) && text
          ? [
              {
                time: payload.t / 1000,
                text
              }
            ]
          : [];
      } catch (error) {
        return [];
      }
    }

    const timePattern = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;
    const timestamps = [...trimmedLine.matchAll(timePattern)];

    if (timestamps.length === 0) {
      return [];
    }

    const trailingText = trimmedLine.slice(
      timestamps[timestamps.length - 1].index + timestamps[timestamps.length - 1][0].length
    ).trim();
    const allTimestampsLeadSameText =
      timestamps.length > 1 &&
      trailingText &&
      timestamps.every((match, index) => {
        const nextMatch = timestamps[index + 1];
        return !nextMatch || trimmedLine.slice(match.index + match[0].length, nextMatch.index).trim() === "";
      });

    if (allTimestampsLeadSameText) {
      return timestamps.map((match) => ({
        time: parseTimestamp(match[1], match[2], match[3]),
        text: trailingText
      }));
    }

    const segmentedLines = timestamps
      .map((match, index) => {
        const nextMatch = timestamps[index + 1];
        const textStart = match.index + match[0].length;
        const textEnd = nextMatch ? nextMatch.index : trimmedLine.length;
        const text = trimmedLine.slice(textStart, textEnd).trim();

        return text
          ? {
              time: parseTimestamp(match[1], match[2], match[3]),
              text
            }
          : null;
      })
      .filter(Boolean);

    if (segmentedLines.length > 0) {
      return segmentedLines;
    }

    const text = trimmedLine.replace(timePattern, "").trim();

    return text
      ? timestamps.map((match) => ({
          time: parseTimestamp(match[1], match[2], match[3]),
          text
        }))
      : [];
  }

  function parseLyrics(text) {
    return text
      .split(/\r?\n/)
      .flatMap(parseLyricLine)
      .sort((a, b) => a.time - b.time);
  }

  async function loadLyrics(track) {
    if (!track.lyricFileName) {
      return [];
    }

    if (lyricCache.has(track.lyricFileName)) {
      return lyricCache.get(track.lyricFileName);
    }

    try {
      const response = await fetch(getAssetSrc(track.lyricFileName), {
        cache: "force-cache"
      });

      if (!response.ok) {
        throw new Error("Lyrics not found");
      }

      const lyrics = parseLyrics(await response.text());
      lyricCache.set(track.lyricFileName, lyrics);
      return lyrics;
    } catch (error) {
      lyricCache.set(track.lyricFileName, []);
      return [];
    }
  }

  function createPlayer(root = document) {
    const nameEl = root.getElementById("currentMusicName");
    const lyricEl = root.getElementById("currentLyricLine");
    const muteButton = root.getElementById("musicMuteButton");

    if (!nameEl || tracks.length === 0) {
      return null;
    }

    const audio = new Audio();
    const state = {
      audio,
      currentIndex: pickRandomIndex(),
      currentLyrics: [],
      lyricIndex: -1,
      started: false,
      readyPromise: null,
      currentSrc: "",
      usingMobileAudio: false
    };

    function setTrackLabel(track, status = "") {
      nameEl.textContent = status ? `${track.name}（${status}）` : track.name;
    }

    function setLyric(text = "") {
      if (lyricEl) {
        lyricEl.textContent = text;
        lyricEl.hidden = !text;
      }
    }

    function updateMuteButton() {
      if (!muteButton) {
        return;
      }

      muteButton.textContent = audio.muted ? "取消静音" : "静音";
      muteButton.setAttribute("aria-pressed", String(audio.muted));
    }

    function syncLyric() {
      if (!state.currentLyrics.length) {
        return;
      }

      const currentTime = audio.currentTime;
      let nextIndex = state.currentLyrics.findIndex((line, index) => {
        const nextLine = state.currentLyrics[index + 1];
        return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
      });

      if (nextIndex < 0) {
        nextIndex = currentTime < state.currentLyrics[0].time ? -1 : state.currentLyrics.length - 1;
      }

      if (nextIndex !== state.lyricIndex) {
        state.lyricIndex = nextIndex;
        setLyric(nextIndex >= 0 ? state.currentLyrics[nextIndex].text : "");
      }
    }

    async function prepareTrack() {
      const track = tracks[state.currentIndex];
      state.usingMobileAudio = shouldUseMobileAudio();
      const src = getAudioSrc(track.fileName);

      if (audio.dataset.trackSrc !== src) {
        audio.dataset.trackSrc = src;
        audio.src = src;
        audio.load();
      }

      state.currentSrc = src;
      nameEl.dataset.audioSrc = src;
      nameEl.dataset.mobileAudio = String(state.usingMobileAudio);
      state.currentLyrics = await loadLyrics(track);
      state.lyricIndex = -1;
      setTrackLabel(track);
      setLyric("");
      syncLyric();
    }

    function ensureTrackReady() {
      if (!state.readyPromise) {
        state.readyPromise = prepareTrack();
      }

      return state.readyPromise;
    }

    async function playCurrentTrack() {
      await ensureTrackReady();
      await audio.play();
    }

    function removeUnlockListeners() {
      window.removeEventListener("pointerdown", startMusic);
      window.removeEventListener("keydown", startMusic);
    }

    function startMusic() {
      if (state.started) {
        return;
      }

      state.started = true;
      playCurrentTrack()
        .then(removeUnlockListeners)
        .catch(() => {
          state.started = false;
          setTrackLabel(tracks[state.currentIndex], "点击页面后播放");
        });
    }

    function playRandomTrack() {
      state.currentIndex = pickRandomIndex(state.currentIndex);
      state.started = false;
      state.readyPromise = null;
      audio.removeAttribute("src");
      audio.removeAttribute("data-track-src");
      audio.load();
      startMusic();
    }

    audio.preload = "metadata";
    audio.volume = volume;
    audio.addEventListener("ended", playRandomTrack);
    audio.addEventListener("timeupdate", syncLyric);
    nameEl.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });
    nameEl.addEventListener("click", playRandomTrack);

    if (muteButton) {
      muteButton.addEventListener("click", () => {
        audio.muted = !audio.muted;
        updateMuteButton();
      });
      updateMuteButton();
    }

    setTrackLabel(tracks[state.currentIndex], "准备播放");
    setLyric("");
    window.addEventListener("pointerdown", startMusic);
    window.addEventListener("keydown", startMusic);
    window.PLCMusicPlayerState = state;

    return state;
  }

  window.PLCMusicPlayer = {
    init: createPlayer
  };
})();
