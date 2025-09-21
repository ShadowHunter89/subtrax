
import { Subscription } from "../models/subscription";
import { UserPreferences } from "../types";

export class SubscriptionOptimizer {
    private subscriptions: Subscription[];

    constructor(subscriptions: Subscription[]) {
        if (!Array.isArray(subscriptions)) {
            throw new Error("Subscriptions must be an array");
        }
        this.subscriptions = subscriptions;
    }

    /**
     * Returns only active subscriptions, sorted by renewal date (soonest first).
     */
    optimizeSubscriptions(): Subscription[] {
        return this.subscriptions
            .filter(subscription => subscription.isActive())
            .sort((a, b) => a.renewalDate.getTime() - b.renewalDate.getTime());
    }

    /**
     * Returns recommendations based on user preferences (budget, categories, frequency).
     * Example: filter by budget and preferred categories.
     */
    getSubscriptionRecommendations(userPreferences: UserPreferences): Subscription[] {
        let result = this.subscriptions;
        if (userPreferences.preferredCategories && userPreferences.preferredCategories.length > 0) {
            result = result.filter(sub =>
                userPreferences.preferredCategories.some(cat => sub.name.toLowerCase().includes(cat.toLowerCase()))
            );
        }
        if (userPreferences.budget && userPreferences.budget > 0) {
            // Only include subscriptions within budget
            const total = result.reduce((sum, sub) => sum + sub.cost, 0);
            if (total > userPreferences.budget) {
                // Suggest removing the most expensive until within budget
                result = [...result].sort((a, b) => b.cost - a.cost);
                let runningTotal = total;
                while (result.length > 0 && runningTotal > userPreferences.budget) {
                    runningTotal -= result[0].cost;
                    result.shift();
                }
            }
        }
        // Optionally, filter by frequency or other preferences
        return result;
    }

    /**
     * Returns a summary of the user's subscription spending.
     */
    getSpendingSummary(): { total: number; active: number; inactive: number } {
        const total = this.subscriptions.reduce((sum, sub) => sum + sub.cost, 0);
        const active = this.subscriptions.filter(sub => sub.isActive()).length;
        const inactive = this.subscriptions.length - active;
        return { total, active, inactive };
    }
}