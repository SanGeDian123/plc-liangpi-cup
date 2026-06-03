(function () {
  const STORAGE_KEY = "plc.players.cache.v3";
  const LEGACY_STORAGE_KEYS = [
    "plc.players.cache.v1",
    "plc.players.cache.v2"
  ];
  const SNAPSHOT_URL = "./assets/players-snapshot.json";
  const API_TIMEOUT_MS = 12000;
  const SNAPSHOT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

  try {
    LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    // Storage can be unavailable in private browsing; network refresh still works.
  }

  function normalizePlayers(value) {
    const players = Array.isArray(value) ? value : value?.players;

    if (!Array.isArray(players)) {
      return [];
    }

    return players
      .filter(Boolean)
      .map((player) => ({
        ...player,
        score: Number(player.score)
      }))
      .filter((player) => Number.isFinite(player.score))
      .sort((a, b) => b.score - a.score);
  }

  function parseSnapshotTime(value) {
    const time = Date.parse(value || "");
    return Number.isFinite(time) ? time : 0;
  }

  function isPayloadUsable(payload) {
    const updatedAt = parseSnapshotTime(payload?.updatedAt || payload?.updated_at);
    const expiresAt = parseSnapshotTime(payload?.expiresAt || payload?.expires_at);
    const now = Date.now();

    if (expiresAt && expiresAt <= now) {
      return false;
    }

    if (updatedAt && now - updatedAt > SNAPSHOT_MAX_AGE_MS) {
      return false;
    }

    return true;
  }

  function normalizePayload(payload, fallbackSource) {
    const players = normalizePlayers(payload);

    if (players.length === 0 || !isPayloadUsable(payload)) {
      return null;
    }

    const updatedAt =
      parseSnapshotTime(payload?.updatedAt || payload?.updated_at) ||
      Date.now();
    const expiresAt = parseSnapshotTime(
      payload?.expiresAt || payload?.expires_at
    );

    return {
      players,
      updatedAt,
      expiresAt,
      source: payload?.source || fallbackSource
    };
  }

  function readStoredPlayers() {
    try {
      const payload = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return normalizePayload(payload, "local");
    } catch (error) {
      return null;
    }
  }

  function writeStoredPlayers(payload) {
    if (!payload || !Array.isArray(payload.players)) {
      return;
    }

    const current = readStoredPlayers();

    if (current && current.updatedAt > payload.updatedAt) {
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          updatedAt: new Date(payload.updatedAt).toISOString(),
          expiresAt: payload.expiresAt
            ? new Date(payload.expiresAt).toISOString()
            : "",
          source: payload.source,
          players: payload.players
        })
      );
    } catch (error) {
      // Storage can be unavailable in private browsing; the snapshot still works.
    }
  }

  async function loadSnapshotPlayers() {
    const response = await fetch(SNAPSHOT_URL, {
      cache: "force-cache"
    });

    if (!response.ok) {
      throw new Error("Snapshot request failed");
    }

    const payload = normalizePayload(await response.json(), "snapshot");

    if (!payload) {
      throw new Error("Snapshot is empty or expired");
    }

    writeStoredPlayers(payload);
    return payload;
  }

  async function fetchFreshPlayers() {
    if (typeof API_URL === "undefined") {
      throw new Error("API_URL is not defined");
    }

    const controller =
      typeof AbortController === "function" ? new AbortController() : null;
    const timer = controller
      ? setTimeout(() => controller.abort(), API_TIMEOUT_MS)
      : null;

    try {
      const response = await fetch(`${API_URL}/players`, {
        cache: "no-store",
        signal: controller?.signal
      });

      if (!response.ok) {
        throw new Error("Players request failed");
      }

      const headerUpdatedAt = Date.parse(
        response.headers.get("X-Players-Updated-At") || ""
      );
      const payload = normalizePayload(await response.json(), "api");

      if (!payload) {
        throw new Error("Players response is empty");
      }

      payload.updatedAt = headerUpdatedAt || Date.now();
      payload.source = "api";

      writeStoredPlayers(payload);
      return payload;
    } finally {
      clearTimeout(timer);
    }
  }

  function hydratePlayers({ onUpdate, onError } = {}) {
    let renderedAt = 0;

    function emit(payload) {
      if (!payload || payload.updatedAt < renderedAt) {
        return;
      }

      renderedAt = payload.updatedAt;

      if (typeof onUpdate === "function") {
        onUpdate(payload.players, {
          source: payload.source,
          updatedAt: payload.updatedAt
        });
      }
    }

    const stored = readStoredPlayers();

    if (stored) {
      emit(stored);
    }

    loadSnapshotPlayers()
      .then(emit)
      .catch(() => {});

    fetchFreshPlayers()
      .then(emit)
      .catch((error) => {
        if (renderedAt === 0 && typeof onError === "function") {
          onError(error);
        }
      });
  }

  window.PLCPlayersCache = {
    hydrate: hydratePlayers,
    fetchFresh: fetchFreshPlayers,
    loadSnapshot: loadSnapshotPlayers,
    readStored: readStoredPlayers
  };
})();
