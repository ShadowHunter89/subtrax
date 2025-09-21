"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
class Subscription {
    constructor(id, name, cost, renewalDate) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.renewalDate = renewalDate;
    }
    isActive() {
        const today = new Date();
        return this.renewalDate > today;
    }
    getDetails() {
        return `Subscription: ${this.name}, Cost: $${this.cost}, Renewal Date: ${this.renewalDate.toDateString()}`;
    }
}
exports.Subscription = Subscription;
