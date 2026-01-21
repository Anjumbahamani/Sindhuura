// services/match.service.js
import apiClient from "./apiClient";
import { API_ROUTES } from "../constants/ApiRoutes";

export const getMatchingProfiles = async (token, filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.append(key, value);
    }
  });

  const url = params.toString()
    ? `${API_ROUTES.MATCH.MATCHING_PROFILES}?${params.toString()}`
    : API_ROUTES.MATCH.MATCHING_PROFILES;

  return apiClient(url, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const searchMatches = async (query, token) => {
  return apiClient(
    `${API_ROUTES.MATCH.SEARCH}?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
};




// export const sendInterestRequest = async (profileId, token) => {
//   return apiClient(API_ROUTES.MATCH.SEND_INTEREST, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     body: JSON.stringify(payload),
//   });
// };
export const sendInterestRequest = async (profileId, token) => {
  const url = `${API_ROUTES.MATCH.SEND_INTEREST}${profileId}/`;

  return apiClient(url, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const getSentRequests = async (token) => {
  return apiClient(API_ROUTES.MATCH.SENT_REQUESTS, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const getReceivedRequests = async (token) => {
  return apiClient(API_ROUTES.MATCH.RECEIVED_REQUESTS, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const getMatchDetails = async (userId, token) => {
  return apiClient(`${API_ROUTES.MATCH.DETAILS}${userId}/`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const acceptRequest = async (requestId, token) => {
  return apiClient(`${API_ROUTES.MATCH.ACCEPT_REQUEST}${requestId}/`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const rejectRequest = async (requestId, token) => {
  return apiClient(`${API_ROUTES.MATCH.REJECT_REQUEST}${requestId}/`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

// Success stories shown publicly on Home
export const getAllSuccessStories = async (token) => {
  return apiClient(API_ROUTES.MATCH.GET_SUCCESS_STORIES, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const getBanners = async (token) =>
  apiClient(API_ROUTES.MATCH.GET_BANNERS, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

export const getEvents = async (token) =>
  apiClient(API_ROUTES.MATCH.GET_EVENTS, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });


  export const searchSentRequests = async (query, token) => {
  return apiClient(
    `  ${API_ROUTES.MATCH.SEARCH_SENT_REQUESTS}?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
};

export const searchReceivedRequests = async (query, token) => {
  return apiClient(
    `  ${API_ROUTES.MATCH.SEARCH_RECEIVED_REQUESTS}?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
};


export const getInterestDetails = async (id, token) => {
  return apiClient(`${API_ROUTES.MATCH.INTEREST_DETAILS}${id}/`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

