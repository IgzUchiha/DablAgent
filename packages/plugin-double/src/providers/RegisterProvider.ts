import { elizaLogger } from '@elizaos/core';
import { ProjectData } from '../types/Register';
import axios from 'axios';
import { DEFAULT_ADMIN_ID, API_DEFAULTS } from '../constants';

interface ProjectResponse {
    success: boolean;
    data?: ProjectData;
    error?: string;
}

interface ProjectListResponse {
    success: boolean;
    data?: ProjectData[];
    error?: string;
}

export class RegisterProvider {
    private apiUrl: string;

    constructor(apiUrl: string = API_DEFAULTS.BASE_URL) {
        this.apiUrl = apiUrl;
        elizaLogger.info('[✅ DOUBLE] RegisterProvider - Initialized with API URL:', this.apiUrl);
    }

    async registerProject(project: ProjectData, castText: string): Promise<boolean> {
        try {
            elizaLogger.info('[🔄 DOUBLE] RegisterProvider - Registering project:', project);

            // Add adminId to projectData
            const projectModified = {
                ...project,
                adminId: project.adminId || DEFAULT_ADMIN_ID
            }
            elizaLogger.info('[🔄 DOUBLE] RegisterProvider - Project modified:', projectModified);
            const response = await axios.post<ProjectResponse>(
                `${this.apiUrl}/projects`,
                projectModified,
                {
                    headers: API_DEFAULTS.HEADERS,
                    timeout: API_DEFAULTS.TIMEOUT
                }
            );


            elizaLogger.info('[✅ DOUBLE] RegisterProvider - Project registered successfully:', response.data);
            return true;

        } catch (error) {
            if (axios.isAxiosError(error)) {
                elizaLogger.error('[❌ DOUBLE] RegisterProvider - API error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
                throw new Error(error.response?.data?.error || error.message);
            }
            elizaLogger.error('[❌ DOUBLE] RegisterProvider - Unknown error:', error);
            throw new Error('Unknown error occurred while registering project');
        }
    }

    async getProject(name: string): Promise<ProjectData | null> {
        try {
            elizaLogger.info('[🔄 DOUBLE] RegisterProvider - Fetching project:', name);

            const response = await axios.get<ProjectResponse>(
                `${this.apiUrl}/projects/${encodeURIComponent(name)}`
            );

            if (!response.data.success || !response.data.data) {
                elizaLogger.warn('[⚠️ DOUBLE] RegisterProvider - Project not found:', name);
                return null;
            }

            elizaLogger.info('[✅ DOUBLE] RegisterProvider - Project found:', response.data.data);
            return response.data.data;

        } catch (error) {
            if (axios.isAxiosError(error)) {
                elizaLogger.error('[❌ DOUBLE] RegisterProvider - API error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
                return null;
            }
            elizaLogger.error('[❌ DOUBLE] RegisterProvider - Unknown error:', error);
            return null;
        }
    }

    async listProjects(): Promise<ProjectData[]> {
        try {
            elizaLogger.info('[🔄 DOUBLE] RegisterProvider - Listing all projects');

            const response = await axios.get<ProjectListResponse>(
                `${this.apiUrl}/projects`
            );

            if (!response.data.success || !response.data.data) {
                elizaLogger.warn('[⚠️ DOUBLE] RegisterProvider - No projects found');
                return [];
            }

            elizaLogger.info('[✅ DOUBLE] RegisterProvider - Projects retrieved:', response.data.data.length);
            return response.data.data;

        } catch (error) {
            if (axios.isAxiosError(error)) {
                elizaLogger.error('[❌ DOUBLE] RegisterProvider - API error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
                return [];
            }
            elizaLogger.error('[❌ DOUBLE] RegisterProvider - Unknown error:', error);
            return [];
        }
    }
}