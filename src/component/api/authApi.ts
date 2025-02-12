const authApi = (() => {
  const BASE_URL = "http://localhost:8080/api";

  async function _fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = getAccessToken();
    if (!token) {
      throw new Error("tidak ada token");
    }
    const headers = {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    return response.json();
  }

  function getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  function getAccessRole() {
    return localStorage.getItem("accessRole");
  }

  async function login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const response = await fetch(`${BASE_URL}/users/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const responseJson = await response.json();
    const { data, errors } = responseJson;

    if (!response.ok) {
      const message = errors?.error?.message;
      throw new Error(message);
    }

    const { access_token } = data.token;
    const access_role = data.user.user_roles[0].roles.name;

    return { access_token, access_role };
  }

  return {
    login,
    getAccessToken,
    getAccessRole,
    _fetchWithAuth,
  };
})();

export default authApi;
