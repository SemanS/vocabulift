import { GetUserCreateApiResponse, GetUserCreateApiArg, GetUserCurrentApiResponse, GetUserCurrentApiArg, User } from './types';
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
  }),
  overrideExisting: false,
});
export { injectedRtkApi as userApi };
