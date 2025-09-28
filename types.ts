export enum Classification {
    SPAM = "Spam",
    NOT_SPAM = "Not Spam",
}

export enum View {
    INBOX = "Inbox",
    SPAM = "Spam",
}

export interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    classification: Classification;
    modelConfidence: number;
    userCorrected: boolean;
}

export interface ClassificationResult {
    classification: Classification;
    confidence: number;
}
