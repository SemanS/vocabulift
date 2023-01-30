import { MenuList } from "@/models/menu.interface";
import { LoginParams, LoginResult } from "@/models/login";
import { CurrentUserResult } from "@/models/user";
import {
  useBatch,
  useCreate,
  useGetList,
  useGetOne,
  useUpdate,
} from "./request";

const projectResource = "/projects";

export const useLogin = () => {
  const baseUrl = import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT;
  return useCreate<LoginParams, LoginResult>(`${baseUrl}/login`);
};

export const useGetCurrentUser = () => {
  const baseUrl = import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT;
  return useGetOne<CurrentUserResult>("CurrentUser", `${baseUrl}/current/user`);
};

export const useGetCurrentMenus = () => {
  const baseUrl = import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT;
  return useGetList<MenuList>("CurrentMenuList", `${baseUrl}/current/menu`);
};
export const useGetProjects = (pagination: any, filters: any) => {
  return useGetList<API.ProjectPagination>(
    "Projects",
    projectResource,
    pagination,
    filters
  );
};
export const useAddProject = () => {
  return useCreate<API.Project, API.Project>(projectResource);
};

export const useUpdateProject = () => {
  return useUpdate<API.Project>(projectResource);
};

export const useBatchDeleteProject = () => {
  return useBatch(projectResource + ":batchDelete");
};
