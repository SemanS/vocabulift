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
  //const baseUrl = "https://vocabulift.com/api/v1"
  const baseUrl = "http://localhost:3000/api/v1";
  //return useCreate<LoginParams, LoginResult>("/login");
  return useCreate<LoginParams, LoginResult>(`${baseUrl}/login`);
};

export const useGetCurrentUser = () => {
  //const baseUrl = "https://vocabulift.com/api/v1";
  const baseUrl = "http://localhost:3000";
  return useGetOne<CurrentUserResult>(
    "CurrentUser",
    `${baseUrl}/current/user`
    //"/current/user"
  );
};

export const useGetCurrentMenus = () => {
  //const baseUrl = "https://vocabulift.com/api/v1";
  const baseUrl = "http://localhost:3000/api/v1";
  return useGetList<MenuList>(
    "CurrentMenuList",
    //"/current/menu"
    `${baseUrl}/current/menu`
  );
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
