import { useMemo } from 'react';

export const usePromptVariables = (content: string, originalContent: string) => {
    const inputVariables = useMemo(() => {
        const matches = content.match(/{[^}]+}/g) || [];
        return [...new Set(matches)].map(match => match.slice(1, -1));
    }, [content]);

    const originalVariables = useMemo(() => {
        const matches = originalContent.match(/{[^}]+}/g) || [];
        return [...new Set(matches)].map(match => match.slice(1, -1));
    }, [originalContent]);

    const hasVariablesChanged = useMemo(() => {
        const currentVars = new Set(inputVariables);
        const previousVars = new Set(originalVariables);

        if (currentVars.size !== previousVars.size) return true;
        return [...currentVars].some(v => !previousVars.has(v));
    }, [inputVariables, originalVariables]);

    return {
        inputVariables,
        originalVariables,
        hasVariablesChanged
    };
}; 