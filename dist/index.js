"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subscriptionOptimizer_1 = require("./services/subscriptionOptimizer");
const init = () => {
    console.log('Initializing Subtrax...');
    // Start with an empty subscriptions array; real data is provided via API in production
    const optimizer = new subscriptionOptimizer_1.SubscriptionOptimizer([]);
    const optimized = optimizer.optimizeSubscriptions();
    console.log('Optimized subscriptions (startup):', optimized);
    console.log('Subtrax initialized successfully.');
};
init();
