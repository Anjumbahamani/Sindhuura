// const apiClient = async (url, options = {}) => {
//   try {
//     const response = await fetch(url, {
//       ...options,
//     });

//     // Read raw text first
//     const text = await response.text();
//     let data = null;

//     try {
//       data = text ? JSON.parse(text) : null;
//     } catch {
//       data = text || null;
//     }

//     if (!response.ok) {
//       // Throw parsed error payload
//       throw data || { message: "Request failed", status: response.status };
//     }

//     return data;
//   } catch (error) {
//     // Just rethrow so callers (useRegister, etc.) can format it
//     throw error;
//   }
// };

// export default apiClient;

const apiClient = async (url, options = {}) => {
  try {
    // Get token automatically
    const token = localStorage.getItem("authToken");

    const headers = {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const text = await response.text();
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text || null;
    }

    // 🔥 If token expired or unauthorized
    if (response.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
      return;
    }

    if (!response.ok) {
      throw data || { message: "Request failed", status: response.status };
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;
