(function () {
  const SUPABASE_URL = "https://kpjuerikmmajqyxcocos.supabase.co";
  const SUPABASE_KEY = "sb_publishable_Jkj-377OvvQXVtiR-Vdikw_FJbPQ_zs";
  const SUPABASE_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  const STORAGE_KEY = "plc-user-session";
  const SESSION_REFRESH_WINDOW_SECONDS = 300;

  const links = Array.from(document.querySelectorAll("[data-plc-account-link]"));
  const listeners = new Set();
  let currentSession = null;
  let accountClient = null;
  let supabaseSdkPromise = null;
  let sessionRefreshPromise = null;
  let hasRenderedSession = false;

  function getUserPageUrl() {
    return new URL("./user", window.location.href).href;
  }

  function getUserNickname(user) {
    return (
      user?.user_metadata?.nickname ||
      user?.user_metadata?.Nickname ||
      user?.email?.split("@")[0] ||
      "未登录"
    );
  }

  function readStoredSession() {
    try {
      const session = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return session?.access_token && session?.user ? session : null;
    } catch (error) {
      return null;
    }
  }

  function getSessionExpiresAt(session) {
    const expiresAt = Number(session?.expires_at);

    if (Number.isFinite(expiresAt) && expiresAt > 0) {
      return expiresAt;
    }

    try {
      const payload = JSON.parse(atob(String(session?.access_token || "").split(".")[1] || ""));
      const jwtExpiresAt = Number(payload?.exp);
      return Number.isFinite(jwtExpiresAt) ? jwtExpiresAt : 0;
    } catch (error) {
      return 0;
    }
  }

  function shouldRefreshSession(session) {
    if (!session?.access_token || !session?.refresh_token) {
      return false;
    }

    const expiresAt = getSessionExpiresAt(session);

    if (!expiresAt) {
      return true;
    }

    return expiresAt - Math.floor(Date.now() / 1000) <= SESSION_REFRESH_WINDOW_SECONDS;
  }

  function loadSupabaseSdk() {
    if (window.supabase?.createClient) {
      return Promise.resolve(window.supabase);
    }

    if (supabaseSdkPromise) {
      return supabaseSdkPromise;
    }

    supabaseSdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SUPABASE_SCRIPT_URL;
      script.async = true;
      script.onload = () => {
        if (window.supabase?.createClient) {
          resolve(window.supabase);
        } else {
          supabaseSdkPromise = null;
          reject(new Error("supabase-sdk-unavailable"));
        }
      };
      script.onerror = () => {
        supabaseSdkPromise = null;
        reject(new Error("supabase-sdk-load-failed"));
      };
      document.head.appendChild(script);
    });

    return supabaseSdkPromise;
  }

  async function ensureAccountClient() {
    if (accountClient) {
      return accountClient;
    }

    await loadSupabaseSdk();

    if (!window.supabase?.createClient) {
      throw new Error("supabase-sdk-unavailable");
    }

    accountClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: true,
        storageKey: STORAGE_KEY
      }
    });

    accountClient.auth.onAuthStateChange((_event, session) => {
      setSession(session || readStoredSession());
    });

    return accountClient;
  }

  function emitAccountChange() {
    listeners.forEach((listener) => {
      try {
        listener(currentSession);
      } catch (error) {
        // Keep one page listener from breaking the shared account state.
      }
    });
  }

  function getSessionUserId(session) {
    return session?.user?.id || "";
  }

  function isSameSession(left, right) {
    return (
      (left?.access_token || "") === (right?.access_token || "") &&
      getSessionUserId(left) === getSessionUserId(right)
    );
  }

  function renderAccount(user) {
    const nickname = user ? getUserNickname(user) : "未登录";

    links.forEach((link) => {
      const name = link.querySelector("[data-plc-account-name]");
      link.href = getUserPageUrl();
      link.classList.toggle("is-signed-out", !user);
      link.setAttribute(
        "aria-label",
        user ? `账号：${nickname}` : "未登录，前往用户中心"
      );

      if (name) {
        name.textContent = nickname;
      }
    });
  }

  function setSession(session) {
    const nextSession = session || null;

    if (hasRenderedSession && isSameSession(currentSession, nextSession)) {
      return;
    }

    currentSession = nextSession;
    renderAccount(currentSession?.user || null);
    hasRenderedSession = true;
    emitAccountChange();
  }

  window.PLCAccount = {
    getSession() {
      return currentSession;
    },
    getUser() {
      return currentSession?.user || null;
    },
    getAccessToken() {
      return currentSession?.access_token || "";
    },
    ensureFreshSession(options = {}) {
      return ensureFreshSession(options);
    },
    getNickname() {
      return currentSession?.user ? getUserNickname(currentSession.user) : "";
    },
    onChange(listener) {
      if (typeof listener !== "function") {
        return () => {};
      }

      listeners.add(listener);
      listener(currentSession);

      return () => {
        listeners.delete(listener);
      };
    },
    ready: Promise.resolve(currentSession)
  };

  async function bootAccountLink() {
    setSession(readStoredSession());

    return ensureFreshSession();
  }

  async function ensureFreshSession(options = {}) {
    if (sessionRefreshPromise) {
      return sessionRefreshPromise;
    }

    sessionRefreshPromise = refreshStoredSession(options).finally(() => {
      sessionRefreshPromise = null;
    });

    return sessionRefreshPromise;
  }

  async function refreshStoredSession(options = {}) {
    const storedSession = readStoredSession();
    setSession(storedSession);

    if (!storedSession) {
      return null;
    }

    if (!options.force && !shouldRefreshSession(storedSession)) {
      return currentSession;
    }

    try {
      const client = await ensureAccountClient();
      const { data, error } = await client.auth.getSession();

      if (error) {
        throw error;
      }

      setSession(data.session || readStoredSession());
    } catch (error) {
      setSession(readStoredSession());
    }

    return currentSession;
  }

  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      setSession(readStoredSession());
    }
  });

  window.PLCAccount.ready = bootAccountLink().catch(() => {
    setSession(readStoredSession());
    return currentSession;
  });
})();
