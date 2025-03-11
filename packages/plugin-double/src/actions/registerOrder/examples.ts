import { ActionExample } from '@elizaos/core';

export const examples: ActionExample[][] = [
    [
        {
            user: '{{user}}',
            content: {
                text: 'Place my order for a large pepperoni pizza with extra cheese from Domino\'s and a Coke',
                action: 'REGISTER_ORDER',
                orderDetails: {
                    restaurant: {
                        name: "Domino's Pizza",
                        type: "Pizza",
                        cuisine: "Italian-American"
                    },
                    items: [
                        {
                            name: "Pepperoni Pizza",
                            size: "Large",
                            customizations: [
                                {
                                    type: "add",
                                    item: "Extra Cheese",
                                    price: 2.99
                                }
                            ],
                            quantity: 1,
                            basePrice: 14.99
                        },
                        {
                            name: "Coca-Cola",
                            size: "Regular",
                            quantity: 1,
                            basePrice: 2.99
                        }
                    ],
                    deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
                    estimatedTotal: 20.97
                }
            }
        },
        {
            user: 'DoubleAgent',
            content: {
                text: 'Order placed successfully! Your order will be delivered in approximately 30-45 minutes.',
                action: 'REGISTER_ORDER',
                orderConfirmation: {
                    orderId: "DOM-12345",
                    status: "CONFIRMED",
                    estimatedDelivery: "30-45 minutes",
                    trackingUrl: "https://dominos.com/track/DOM-12345",
                    paymentStatus: "COMPLETED",
                    total: 20.97
                }
            }
        }
    ],
    [
        {
            user: '{{user}}',
            content: {
                text: 'Order my McDonald\'s meal: double cheeseburger combo with large fries, no pickles, extra onions and a Diet Coke for pickup',
                action: 'REGISTER_ORDER',
                orderDetails: {
                    restaurant: {
                        name: "McDonald's",
                        type: "Fast Food",
                        cuisine: "American"
                    },
                    items: [
                        {
                            name: "Double Cheeseburger Meal",
                            customizations: [
                                {
                                    type: "remove",
                                    item: "Pickles"
                                },
                                {
                                    type: "add",
                                    item: "Extra Onions"
                                }
                            ],
                            sides: [
                                {
                                    name: "French Fries",
                                    size: "Large",
                                    basePrice: 3.99
                                }
                            ],
                            drinks: [
                                {
                                    name: "Diet Coke",
                                    size: "Regular",
                                    basePrice: 1.99
                                }
                            ],
                            quantity: 1,
                            basePrice: 8.99
                        }
                    ],
                    pickupDetails: {
                        location: "McDonald's - Times Square",
                        preferredTime: "ASAP"
                    },
                    estimatedTotal: 14.97
                }
            }
        },
        {
            user: 'DoubleAgent',
            content: {
                text: 'Order confirmed for pickup! Your order will be ready in approximately 15-20 minutes.',
                action: 'REGISTER_ORDER',
                orderConfirmation: {
                    orderId: "MCD-67890",
                    status: "CONFIRMED",
                    estimatedPickup: "15-20 minutes",
                    pickupLocation: "McDonald's - Times Square",
                    pickupCode: "2468",
                    paymentStatus: "COMPLETED",
                    total: 14.97
                }
            }
        }
    ]
];

export default examples;