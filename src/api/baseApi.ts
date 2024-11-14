import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const customBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: "include",
});

const baseQueryWithTokenRefresh = async (args, api, extraOptions) => {
  args.headers = args.headers || {};

  try {
    //const token = await refreshTokenIfNeeded();
    const token = "2123";
    if (token) {
      args.headers["Authorization"] = `Bearer ${token}`;
    }
    return customBaseQuery(args, api, extraOptions);
  } catch (error) {
    return { error: { status: "CUSTOM_ERROR", error: error } };
  }
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithTokenRefresh,
  endpoints: () => ({}),
});
