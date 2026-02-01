export const BaseUrl = "https://www.api.chatrizz.co/api/v1/";
// export const BaseUrl = "https://api.sync360.africa/api/v1/";

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${BaseUrl}login`,
  REGISTER: `${BaseUrl}register`,
  LOGOUT: `${BaseUrl}logout`,
  REFRESH_TOKEN: `${BaseUrl}refresh-token`,
  ME: `${BaseUrl}me`,

  // User endpoints
  USERS: `${BaseUrl}users`,
  USER_BY_ID: (id: string) => `${BaseUrl}users/${id}`,

  // Add more endpoints as needed
} as const;
