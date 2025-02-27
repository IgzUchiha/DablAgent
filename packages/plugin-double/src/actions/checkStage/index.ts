import {
    Action,
    IAgentRuntime,
    ActionExample,
    elizaLogger,
    HandlerCallback,
    State,
} from '@elizaos/core';
import { Message, ProjectStage } from '../../types/Register';
import { checkProjectStage, StageAnalysis } from '../../utils/checkStage';
import examples from './examples';

export class CheckProjectStageAction implements Action {
    public name = 'CHECK_PROJECT_STAGE';
    public description = 'Analyze and verify the current stage of a registered project';
    public similes = [
        'VERIFY_STAGE',
        'CHECK_STAGE',
        'ANALYZE_STAGE',
        'PROJECT_STAGE',
    ];
    public examples = examples;

    constructor() {
        elizaLogger.info('[✅ DOUBLE] CheckProjectStageAction - Initialized');
    }

    async validate(
        runtime: IAgentRuntime,
        message: Message
    ): Promise<boolean> {
        try {
            elizaLogger.info('[🔄 DOUBLE] CheckProjectStageAction - Starting validation');

            // Check if we have text to analyze
            if (!message.content.text) {
                elizaLogger.error('[❌ DOUBLE] CheckProjectStageAction - No text provided for analysis');
                return false;
            }

            return true;
        } catch (error) {
            elizaLogger.error('[❌ DOUBLE] CheckProjectStageAction - Validation error:', error);
            return false;
        }
    }

    async handler(
        runtime: IAgentRuntime,
        message: Message,
        state?: State,
        options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> {
        try {
            elizaLogger.info('[🔄 DOUBLE] CheckProjectStageAction - Processing stage check request');

            const stageAnalysis = await checkProjectStage(message.content.text || '', runtime);

            elizaLogger.info('[✅ DOUBLE] CheckProjectStageAction - Stage analysis complete:', {
                stage: stageAnalysis.currentStage,
                details: stageAnalysis.stageDetails
            });

            if (callback) {
                callback({
                    text: this.formatStageAnalysis(stageAnalysis),
                    content: {
                        stageAnalysis
                    },
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error('[❌ DOUBLE] CheckProjectStageAction - Handler error:', error);
            return false;
        }
    }

    private formatStageAnalysis(analysis: StageAnalysis): string {
        return `
Project Stage Analysis:
Current Stage: ${analysis.currentStage}

${analysis.stageDetails.description}

Completed Actions:
${analysis.stageDetails.completedActions.map(action => `- ${action}`).join('\n')}

Next Steps:
${analysis.stageDetails.nextSteps.map(step => `- ${step}`).join('\n')}

Requirements for Next Stage:
${analysis.stageDetails.requirements.map(req => `- ${req}`).join('\n')}
`;
    }
}