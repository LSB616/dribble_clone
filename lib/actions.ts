import { ProjectForm } from "@/common.types";
import { createUserMutation, deleteProjectMutation, getProjectsOfUserQuery, getUserQuery, projectsQuery,projectsQuery2,updateProjectMutation } from "@/graphql";
import { GraphQLClient } from "graphql-request";
import { createProjectMutation, getProjectByIdQuery } from "@/graphql";

const isProduction = process.env.NODE_ENV === 'production';

const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql'

const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : '1234';

const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL || '' : 'http://localhost:3000';

const client = new GraphQLClient(apiUrl)

const makeGraphQLRequest = async (query: string, variables = {}) => {
    try {
        return await client.request(query, variables);
    } catch (error) {
        throw(error)
    }
}

export const getUser = (email: string) => {
    client.setHeader('x-api-key', apiKey);
    return makeGraphQLRequest(getUserQuery, { email })
}

export const createUser = (name: string, email: string, avatarUrl: string) => {
    client.setHeader('x-api-key', apiKey);
    const variables = {
        input: {
            name: name, 
            email: email,
            avatarUrl: avatarUrl
        }
    }
    return makeGraphQLRequest(createUserMutation, variables)
}

export const fetchToken = async () => {
    try {
        const response = await fetch(`${serverUrl}/api/auth/token`)
        return response.json();
    } catch (error) {
        throw error;
    }
}

export const uploadImage = async (imagePath: string) => {
    try {
        const response = await fetch(`${serverUrl}/api/upload`, {
            method: 'POST',
            body: JSON.stringify({ path: imagePath })
        })
        return response.json();
    } catch (error) {
        throw error;
    }
}

export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {
    const imageUrl = await uploadImage(form.image);

    if(imageUrl.url){
        client.setHeader("Authorization", `Bearer ${token}`)
    }

    if(imageUrl.url) {
        const variables = {
            input: {
                ...form,
                image: imageUrl.url,
                createdBy: {
                    link: creatorId
                }
            }
        }
        return makeGraphQLRequest(createProjectMutation, variables)
    }
}

export const fetchAllProjects = (category?: string | null, endcursor?: string | null) => {
    client.setHeader("x-api-key", apiKey);
  
    return makeGraphQLRequest(projectsQuery, { category, endcursor });
  };

export const fetchAllProjects2 = () => {
    client.setHeader("x-api-key", apiKey);
  
    return makeGraphQLRequest(projectsQuery2);
};

export const getProjectDetails = async (id: string) => {
    client.setHeader('x-api-key', apiKey);
    return makeGraphQLRequest(getProjectByIdQuery, { id })
}

export const getUserProjects = async (id: string, last?: number) => {
    client.setHeader('x-api-key', apiKey);
    return makeGraphQLRequest(getProjectsOfUserQuery, { id, last })
}

export const deleteProject = async (id: string, token: string) => {
    client.setHeader("Authorization", `Bearer ${token}`)
    return makeGraphQLRequest(deleteProjectMutation, { id })
}

export const updateProject = async (form: ProjectForm, projectId: string, token: string) => {
    
    const isBase64DataUrl = ( value: string) => {
        const base64Regex = /^data:image\/[a-z]+;base64,/;
        return base64Regex.test(value);
    }

    let updatedForm = { ...form };

    const isUploadingNewImage = isBase64DataUrl(form.image)

    if(isUploadingNewImage){
        const imageUrl = await uploadImage(form.image);

        if(imageUrl.url){
            updatedForm = {
                ...updatedForm,
                image: imageUrl.url
            }
        }
    }
    
    const variables = {
        id: projectId,
        input: updatedForm
    }

    client.setHeader("Authorization", `Bearer ${token}`)
    return makeGraphQLRequest(updateProjectMutation, variables)
}