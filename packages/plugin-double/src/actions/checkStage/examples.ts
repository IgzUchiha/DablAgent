import { ActionExample } from '@elizaos/core';

export const examples: ActionExample[][] = [
    [
        {
            user: '{{user1}}',
            content: {
                text: 'Check the stage of my project ElizaOS. We have completed the initial concept, documentation, and market research. The team is formed and we\'re starting to work on the prototype.',
            },
        },
        {
            user: '{{user2}}',
            content: {
                text: 'Project Stage Analysis Complete',
                action: 'CHECK_PROJECT_STAGE',
                stageAnalysis: {
                    currentStage: 'IDEATION',
                    stageDetails: {
                        description: 'Project is in the ideation phase with completed initial planning',
                        completedActions: [
                            'Defined project concept',
                            'Created basic documentation',
                            'Conducted market research',
                            'Formed initial team'
                        ],
                        nextSteps: [
                            'Begin prototype development',
                            'Create technical specifications',
                            'Set up development environment'
                        ],
                        requirements: [
                            'Working proof of concept',
                            'Basic functionality implementation',
                            'Technical documentation',
                            'Development roadmap'
                        ]
                    }
                }
            },
        },
    ],
    // Add more examples as needed
];

export default examples;