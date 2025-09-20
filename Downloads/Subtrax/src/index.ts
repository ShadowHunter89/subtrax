import { SubscriptionOptimizer } from './services/subscriptionOptimizer';

const init = () => {
    console.log('Initializing Subtrax...');
    
    // Start with an empty subscriptions array; real data is provided via API in production
    const optimizer = new SubscriptionOptimizer([]);
    const optimized = optimizer.optimizeSubscriptions();
    console.log('Optimized subscriptions (startup):', optimized);
    
    console.log('Subtrax initialized successfully.');
};

init();