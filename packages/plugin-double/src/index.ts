import { Plugin, elizaLogger } from "@elizaos/core";
import { RegisterProvider } from './providers/RegisterProvider';
import { RegisterProjectAction } from './actions/register';

console.log("\n┌════════════════════════════════════════┐");
console.log("│          Double PLUGIN                 │");
console.log("├────────────────────────────────────────┤");
console.log("│  Initializing Double Plugin...         │");
console.log("│  Version: 0.0.2                       │");
console.log("└════════════════════════════════════════┘");

elizaLogger.info('[🔄 DOUBLE] Plugin - Initializing');

const registerProvider = new RegisterProvider();
elizaLogger.info('[✅ DOUBLE] Plugin - Register provider initialized');

export const doublePlugin: Plugin = {
    name: "double",
    description: "Agent double with basic actions and evaluators",
    actions: [
        new RegisterProjectAction(registerProvider),
    ],
    evaluators: [],
    providers: [],
};

elizaLogger.info('[✅ DOUBLE] Plugin - Initialization complete');

export default doublePlugin;
