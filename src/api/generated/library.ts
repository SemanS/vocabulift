import { PostLibraryByLibraryIdApiResponse, PostLibraryByLibraryIdApiArg, BookMetadata, SnapshotInfo, Library } from './types';
import { baseApi as api } from "../baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    postLibraryByLibraryId: build.mutation<
      PostLibraryByLibraryIdApiResponse,
      PostLibraryByLibraryIdApiArg
    >({
      query: (queryArg) => ({
        url: `/library/${queryArg.libraryId}`,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as libraryApi };
