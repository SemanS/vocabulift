import { MenuList } from "@/models/menu.interface";
import { LoginParams, LoginResult } from "@/models/login";
import { CurrentUserResult } from "@/models/user";
import { useBatch, useCreate, useGetList, useGetOne, useUpdate } from "./request";

const projectResource = '/projects';

export const useLogin = () => {
    return useCreate<LoginParams, LoginResult>("/login");
}

export const useGetCurrentUser = () => {
    const baseUrl = "http://ec2-18-197-98-20.eu-central-1.compute.amazonaws.com:3000/api/v1"
    return useGetOne<CurrentUserResult>(
        "CurrentUser",
        `${baseUrl}/current/user`
      );
}

export const useGetCurrentMenus = () => {
    return useGetList<MenuList>("CurrentMenuList",
        "/current/menu"
    );

}
export const useGetProjects = (pagination: any, filters: any) => {
    return useGetList<API.ProjectPagination>(
        "Projects",
        projectResource,
        pagination,
        filters
    );
}
export const useAddProject = () => {
    return useCreate<API.Project, API.Project>(projectResource);
}

export const useUpdateProject = () => {
    return useUpdate<API.Project>(projectResource);
}

export const useBatchDeleteProject = () => {
    return useBatch(projectResource + ':batchDelete');
}
