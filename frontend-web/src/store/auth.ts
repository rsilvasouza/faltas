const TOKEN_KEY = "faltas:web:token";

type Listener = () => void;

let token = localStorage.getItem(TOKEN_KEY);
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const authStore = {
  getToken: () => token,
  setToken: (nextToken: string | null) => {
    token = nextToken;
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    notify();
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
