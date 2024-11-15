import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { reactEndpoint } from "config/config";

const customBaseQuery = fetchBaseQuery({
  baseUrl: reactEndpoint,
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
