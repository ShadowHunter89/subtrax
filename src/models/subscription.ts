export class Subscription {
    id: string;
    name: string;
    cost: number;
    renewalDate: Date;

    constructor(id: string, name: string, cost: number, renewalDate: Date) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.renewalDate = renewalDate;
    }

    isActive(): boolean {
        const today = new Date();
        return this.renewalDate > today;
    }

    getDetails(): string {
        return `Subscription: ${this.name}, Cost: $${this.cost}, Renewal Date: ${this.renewalDate.toDateString()}`;
    }
}