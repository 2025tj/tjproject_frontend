/**
 * @typedef {Object} Plan
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} duration
 */

/**
 * @typedef {'ACTIVE' | 'CANCELLED' | 'EXPIRED'} SubscriptionStatus 
 */

/**
 * @typedef {Object} subscriptionDetails
 * @property {Plan} plan
 * @property {string} startDate
 * @property {string} endDate
 * @property {boolean} isActive
 * @property {SubscriptionStatus} status
 */