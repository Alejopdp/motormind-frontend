export enum PromptPhase {
    QUESTIONS_GENERATION = "QUESTIONS_GENERATION",
    PRELIMINARY_DIAGNOSIS = "PRELIMINARY_DIAGNOSIS",
    FINAL_DIAGNOSIS = "FINAL_DIAGNOSIS",
    SYMPTOM_CLASSIFICATION = "SYMPTOM_CLASSIFICATION",
    SYMPTOM_NORMALIZATION = "SYMPTOM_NORMALIZATION",
    ANSWER_NORMALIZATION = "ANSWER_NORMALIZATION",
    YOUTUBE_SEARCH = "YOUTUBE_SEARCH",
    EVALUATION = "EVALUATION",
    YOUTUBE_VIDEO_SELECTION = "YOUTUBE_VIDEO_SELECTION",
    PRELIMINARY_DIAGNOSIS_MORE_REASONS = "PRELIMINARY_DIAGNOSIS_MORE_REASONS",
    PRELIMINARY_DIAGNOSIS_REVIEWER = "PRELIMINARY_DIAGNOSIS_REVIEWER",
}

export enum PromptType {
    SYSTEM = "system",
    USER = "user",
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
    type?: PromptType;
    versions: PromptVersion[];
    workshopId: string;
    createdAt: Date;
    updatedAt: Date;
} 