






export const getProjectNameTemplate = `You are an AI assistant focused solely on extracting project names. Your task is to find and validate a project name from the conversation.




Review the recent messages:

<recent_messages>
{{recentMessages}}
</recent_messages>

Your goal is to extract ONLY the project name, which must be:
- Between 2 and 50 characters long
- A valid project identifier

Before providing the final output, show your reasoning process inside <analysis> tags:

1. Identify potential project names mentioned in the conversation
2. Validate the length (2-50 characters)
3. Select the most appropriate name if multiple are found

After your analysis, provide the final output in a JSON markdown block:

\`\`\`json
{
    "name": string
}
\`\`\`

If no valid project name is found, return null for the name value.

Now, process the conversation and extract the project name.`;



export const projectName: Action = {

}