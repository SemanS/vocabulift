import { GetUserCreateApiResponse, GetUserCreateApiArg, GetUserCurrentApiResponse, GetUserCurrentApiArg, PostUserUpdateApiResponse, PostUserUpdateApiArg, User, UserEntity } from './types';
import { baseApi as api } from "../baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUserCreate: build.query<GetUserCreateApiResponse, GetUserCreateApiArg>({
      query: () => ({ url: `/user/create` }),
    }),
    getUserCurrent: build.query<
      GetUserCurrentApiResponse,
      GetUserCurrentApiArg
    >({
      query: () => ({ url: `/user/current` }),
    }),
    postUserUpdate: build.mutation<
      PostUserUpdateApiResponse,
      PostUserUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/user/update`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as userApi };
