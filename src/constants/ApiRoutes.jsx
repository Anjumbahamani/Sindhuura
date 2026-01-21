const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const API_ROUTES = {
  AUTH: {
    REGISTER: `${API_BASE}/api/auth/register/`,
    LOGIN: `${API_BASE}/api/auth/login/`,
    ADD_PERSONAL_DETAILS: `${API_BASE}/api/auth/add-personal-details/`,
    RELIGIONS: `${API_BASE}/api/auth/religions/`,
    CASTES: `${API_BASE}/api/auth/castes/`,
    SUBSCRIPTION_PLANS: `${API_BASE}/api/auth/subscription-plans/`,
    UPLOAD_IMAGES: `${API_BASE}/api/auth/upload-images/`,
    USER_PROFILE: `${API_BASE}/api/auth/user-profile/`,
    SUBSCRIPTION_DETAILS: `${API_BASE}/api/auth/subscription-details/`,
    SUBSCRIPTION_ORDER: `${API_BASE}/api/auth/subscription/create-order/`,
    SUBSCRIPTION_VERIFY_PAYMENT: `${API_BASE}/api/auth/subscription/verify-payment/`,
    USER_IMAGES: `${API_BASE}/api/auth/user-images/`,
    DELETE_IMAGE: `${API_BASE}/api/auth/delete-image/`,
    ADD_SUCCESS_STORY: `${API_BASE}/api/match/add-success-stories/`,
    MY_SUCCESS_STORY: `${API_BASE}/api/match/my-success-stories/`,
    DELETE_SUCCESS_STORY: `${API_BASE}/api/match/delete-success-story/`,
  },
  MATCH: {
    MATCHING_PROFILES: `${API_BASE}/api/match/matching-profiles/`,
    SEND_INTEREST: `${API_BASE}/api/match/send-interest/`,
    SENT_REQUESTS: `${API_BASE}/api/match/sent-requests/`,
    RECEIVED_REQUESTS: `${API_BASE}/api/match/received-requests/`,
    DETAILS: `${API_BASE}/api/match/details/`,
    ACCEPT_REQUEST: `${API_BASE}/api/match/accept-requests/`,
    REJECT_REQUEST: `${API_BASE}/api/match/reject-requests/`,
    GET_SUCCESS_STORIES: `${API_BASE}/api/match/success-stories/`,
    GET_BANNERS: `${API_BASE}/api/match/banners/`,
    GET_EVENTS: `${API_BASE}/api/match/events/`,
    SEARCH: `${API_BASE}/api/match/search/`,
    SEARCH_SENT_REQUESTS: `${API_BASE}/api/match/sent-requests/`,
    SEARCH_RECEIVED_REQUESTS: `${API_BASE}/api/match/received-requests/`,
    INTEREST_DETAILS: `${API_BASE}/api/match/details/`,
  },
  BLOG: {
    BLOGS: `${API_BASE}/api/auth/blogs/`,
    BLOG_DETAILS: `${API_BASE}/api/auth/blogs/`,
    SEARCH: `${API_BASE}/api/auth/blogs`,
  },
  CHAT: {
    CHATS: `${API_BASE}/api/chat/chats/`,
  },
};

export default API_ROUTES;
