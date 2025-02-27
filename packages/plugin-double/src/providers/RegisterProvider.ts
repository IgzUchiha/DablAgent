import { elizaLogger } from '@elizaos/core';
import { RegisterProvider as IRegisterProvider, ProjectData } from '../types/Register';

export class RegisterProvider implements IRegisterProvider {
    private apiUrl: string;

    constructor(apiUrl: string = process.env.REGISTER_API_URL || 'https://api.example.com') {
        this.apiUrl = apiUrl;
        elizaLogger.info('[✅ DOUBLE] RegisterProvider - Initialized with API URL:', this.apiUrl);
    }

    public async registerProject(project: ProjectData): Promise<boolean> {
        try {
            elizaLogger.info('[🔄 DOUBLE] RegisterProvider - Registering project:', project.name);

            const response = await fetch(`${this.apiUrl}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(project),
            });

            if (!response.ok) {
                elizaLogger.error('[❌ DOUBLE] RegisterProvider - API error:', response.statusText);
                throw new Error(`API error: ${response.statusText}`);
            }

            const result = await response.json();
            elizaLogger.info('[✅ DOUBLE] RegisterProvider - Project registered successfully:', {
                projectName: project.name,
                result
            });
            return true;
        } catch (error) {
            elizaLogger.error('[❌ DOUBLE] RegisterProvider - Failed to register project:', error);
            return false;
        }
    }
}