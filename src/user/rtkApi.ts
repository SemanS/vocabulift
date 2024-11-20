import { userApi } from "../api/generated/user";

const injectedRtkApi = userApi.enhanceEndpoints({
  addTagTypes: ["user", "permissions"],
  endpoints: {
    getUserCreate: {
      providesTags: ["user"],
    },
    getUserCurrent: {
      providesTags: ["user"],
    },
    postUserUpdate: {
      invalidatesTags: ["user"],
    },
  },
});

export const {
  useGetUserCreateQuery,
  useGetUserCurrentQuery,
  usePostUserUpdateMutation,
} = injectedRtkApi;

export { injectedRtkApi as userApi };
