// src/api/api.tsx
import axios from 'axios';

const BASE_URL = 'http://localhost:5094/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAllStudents = async ({ page, size }: { page: number; size: number }) => {
    const response = await apiClient.get(`/Students?pageNumber=${page}&pageSize=${size}`);
    return response.data;
};

export const addAttraction = async (attractionData: any) => {
    const response = await apiClient.post('/addAttraction', attractionData);
    return response.data;
};

export const getAttraction = async (attractionId: string) => {
    const response = await apiClient.get(`/attractions/${attractionId}`);
    return response.data;
};
