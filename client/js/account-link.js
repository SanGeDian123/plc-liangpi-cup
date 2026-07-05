(function () {
  const SUPABASE_URL = "https://kpjuerikmmajqyxcocos.supabase.co";
  const SUPABASE_KEY = "sb_publishable_Jkj-377OvvQXVtiR-Vdikw_FJbPQ_zs";
  const STORAGE_KEY = "plc-user-session";

  const links = Array.from(document.querySelectorAll("[data-plc-account-link]"));
  const listeners = new Set();
  let currentSession = readStoredSession();
  let accountClient = null;

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

  function emitAccountChange() {
    listeners.forEach((listener) => {
      try {
        listener(currentSession);
      } catch (error) {
        // Keep one page listener from breaking the shared account state.
      }
    });
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
    currentSession = session || null;
    renderAccount(currentSession?.user || null);
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

    if (!window.supabase?.createClient) {
      return currentSession;
    }

    accountClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: true,
        storageKey: STORAGE_KEY
      }
    });

    const { data } = await accountClient.auth.getSession();
    setSession(data.session || readStoredSession());

    accountClient.auth.onAuthStateChange((_event, session) => {
      setSession(session || null);
    });

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
