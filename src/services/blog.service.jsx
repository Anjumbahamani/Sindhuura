import apiClient from "./apiClient";
import { API_ROUTES } from ".././constants/ApiRoutes";
export const getBlogs = async (token) => {
  return apiClient(API_ROUTES.BLOG.BLOGS, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const getBlogDetails = async (blogId, token) => {
  return apiClient(`${API_ROUTES.BLOG.BLOG_DETAILS}${blogId}/`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};


export const searchBlogs = async (query, token) =>
  apiClient(
    `${API_ROUTES.BLOG.SEARCH}/?search=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
