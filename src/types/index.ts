export interface Subscription {
    id: string;
    name: string;
    cost: number;
    renewalDate: Date;
    isActive(): boolean;
    getDetails(): string;
}

export interface UserPreferences {
    preferredCategories: string[];
    budget: number;
    frequency: string;
}