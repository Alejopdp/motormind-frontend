export enum PromptPhase {
    QUESTIONS_GENERATION = "QUESTIONS_GENERATION",
    PRELIMINARY_DIAGNOSIS = "PRELIMINARY_DIAGNOSIS",
    FINAL_DIAGNOSIS = "FINAL_DIAGNOSIS",
}

export interface PromptVersion {
    content: string;
    createdAt: Date;
    createdBy: string;
    isActive: boolean;
}

export interface Prompt {
    _id: string;
    phase: PromptPhase;
    versions: PromptVersion[];
    workshopId: string;
    createdAt: Date;
    updatedAt: Date;
} 