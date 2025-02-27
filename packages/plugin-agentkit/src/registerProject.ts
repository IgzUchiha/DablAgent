import type { Provider, IAgentRuntime } from "@elizaos/core";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import * as fs from "fs";
import { z } from "zod";

const PROJECT_DATA_FILE = "project_data.txt";

export async function getClient(): Promise<CdpAgentkit> {
    const apiKeyName = process.env.CDP_API_KEY_NAME;
    const apiKeyPrivateKey = process.env.CDP_API_KEY_PRIVATE_KEY;

    if (!apiKeyName || !apiKeyPrivateKey) {
        throw new Error(
            "Missing required CDP API credentials. Please set CDP_API_KEY_NAME and CDP_API_KEY_PRIVATE_KEY environment variables."
        );
    }

    let projectDataStr: string | null = null;

    if (fs.existsSync(PROJECT_DATA_FILE)) {
        try {
            projectDataStr = fs.readFileSync(PROJECT_DATA_FILE, "utf8");
        } catch (error) {
            console.error("Error reading project data:", error);
        }
    }

    const config = {
        projectData: projectDataStr || undefined,
        networkId: process.env.CDP_AGENT_KIT_NETWORK || "base-sepolia",
        apiKeyName: apiKeyName,
        apiKeyPrivateKey: apiKeyPrivateKey,
    };

    try {
        const agentkit = await CdpAgentkit.configureWithWallet(config);
        const exportedProjectData = await agentkit.exportWallet();
        fs.writeFileSync(PROJECT_DATA_FILE, exportedProjectData);
        return agentkit;
    } catch (error) {
        console.error("Failed to initialize CDP AgentKit:", error);
        throw new Error(
            `Failed to initialize CDP AgentKit: ${error.message || "Unknown error"}`
        );
    }
}

export const projectProvider: Provider = {
    async get(runtime: IAgentRuntime): Promise<string | null> {
        try {
            const client = await getClient();
            const projectId = (await (client as any).wallet.addresses)[0].id;
            return `Registered Project ID: ${projectId}`;
        } catch (error) {
            console.error("Error in project provider:", error);
            return `Error initializing project registration: ${error.message}`;
        }
    },
};

export const projectSchema = z.object({
    firstName: z
        .string()
        .max(50, { message: "First name cannot exceed 50 characters." })
        .optional()
        .nullable(),
    lastName: z
        .string()
        .max(50, { message: "Last name cannot exceed 50 characters." })
        .optional()
        .nullable(),
    cityRegion: z
        .string()
        .max(100, { message: "City/Region cannot exceed 100 characters." })
        .optional()
        .nullable(),
    country: z
        .string()
        .max(50, { message: "Country cannot exceed 50 characters." })
        .optional()
        .nullable(),
    primaryRole: z
        .string()
        .max(50, { message: "Primary role cannot exceed 50 characters." })
        .optional()
        .nullable(),
    professionalProfile: z
        .string()
        .max(50, {
            message: "Professional profile cannot exceed 50 characters.",
        })
        .optional()
        .nullable(),
    isStudent: z.boolean().default(false),
});
