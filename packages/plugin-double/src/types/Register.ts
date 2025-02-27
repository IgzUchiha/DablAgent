export interface RegisterProvider {
    registerProject(project: ProjectData): Promise<boolean>;
}

export interface ProjectData {
    name: string;
    description: string;
    repositoryUrl: string;
    productionUrl?: string | null;
    website?: string | null;
    stage: ProjectStage;
    category: string;
}

export type ProjectStage = 'IDEATION' | 'PROTOTYPE' | 'MVP' | 'GROWTH' | 'FUNDED';

export interface Message {
    content: {
        text?: string;
        project?: ProjectData;
    };
}