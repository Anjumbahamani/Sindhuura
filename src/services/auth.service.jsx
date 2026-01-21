import apiClient from "./apiClient";
import { API_ROUTES } from ".././constants/ApiRoutes";

export const registerUser = async (formData) => {
  return apiClient(API_ROUTES.AUTH.REGISTER, {
    method: "POST",
    body: formData,
  });
};

export const loginUser = async (payload) => {
  return apiClient(API_ROUTES.AUTH.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};
// NEW: lifestyle / personal details API
export const addPersonalDetails = async (payload, token) => {
  return apiClient(API_ROUTES.AUTH.ADD_PERSONAL_DETAILS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
};

export const getSubscriptionPlans = async (token) => {
  return apiClient(API_ROUTES.AUTH.SUBSCRIPTION_PLANS, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};


export const uploadImages = async (formData, token) => {
  return apiClient(API_ROUTES.AUTH.UPLOAD_IMAGES, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
};

export const getUserProfile = async (token) => {
  return apiClient(API_ROUTES.AUTH.USER_PROFILE, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const updateUserProfile = async (payload, token) => {
  return apiClient(API_ROUTES.AUTH.USER_PROFILE, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
};

export const saveSubscriptionDetails = async (payload, token) => {
  return apiClient(API_ROUTES.AUTH.SUBSCRIPTION_DETAILS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
};

export const createSubscriptionOrder = async (payload, token) => {
  return apiClient(API_ROUTES.AUTH.SUBSCRIPTION_ORDER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
};

export const verifySubscriptionPayment = async (payload, token) => {
  return apiClient(API_ROUTES.AUTH.SUBSCRIPTION_VERIFY_PAYMENT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
};


export const getUserImages = async (token) => {
  return apiClient(API_ROUTES.AUTH.USER_IMAGES, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const deleteUserImage = async (imageId, token) => {
  return apiClient(`${API_ROUTES.AUTH.DELETE_IMAGE}${imageId}/`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const getMySuccessStories = async (token) => {
  return apiClient(API_ROUTES.AUTH.MY_SUCCESS_STORY, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const addSuccessStory = async (formData, token) => {
  return apiClient(API_ROUTES.AUTH.ADD_SUCCESS_STORY, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
};

export const deleteSuccessStory = async (storyId, token) => {
  return apiClient(`${API_ROUTES.AUTH.DELETE_SUCCESS_STORY}${storyId}/`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};