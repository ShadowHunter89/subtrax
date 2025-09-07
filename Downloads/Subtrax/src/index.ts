import { SubscriptionOptimizer } from './services/subscriptionOptimizer';

const init = () => {
    console.log('Initializing Subtrax...');
    
    const optimizer = new SubscriptionOptimizer();
    optimizer.optimizeSubscriptions();
    
    console.log('Subtrax initialized successfully.');
};

init();