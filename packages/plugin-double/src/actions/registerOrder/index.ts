import {
    Action,
    IAgentRuntime,
    ActionExample,
    elizaLogger,
    HandlerCallback,
    State,
} from '@elizaos/core';
import { UberEatsProvider } from '../../providers/UberEatsProvider';
import examples from './examples';

interface OrderDetails {
    restaurant: {
        name: string;
        type: string;
        cuisine: string;
    };
    items: {
        name: string;
        size?: string;
        customizations?: {
            type: 'add' | 'remove';
            item: string;
            price?: number;
        }[];
        sides?: {
            name: string;
            size?: string;
            basePrice: number;
        }[];
        drinks?: {
            name: string;
            size?: string;
            basePrice: number;
        }[];
        quantity: number;
        basePrice: number;
    }[];
    deliveryAddress?: string;
    pickupDetails?: {
        location: string;
        preferredTime: string;
    };
    estimatedTotal: number;
}

interface OrderConfirmation {
    orderId: string;
    status: 'CONFIRMED' | 'FAILED' | 'PENDING';
    estimatedDelivery?: string;
    estimatedPickup?: string;
    trackingUrl?: string;
    pickupLocation?: string;
    pickupCode?: string;
    paymentStatus: 'COMPLETED' | 'PENDING' | 'FAILED';
    total: number;
}

export class RegisterOrderAction implements Action {
    private provider: UberEatsProvider;
    public name = 'REGISTER_ORDER';
    public description = 'Place a food order with the specified restaurant';
    public similes = [
        'PLACE_ORDER',
        'SUBMIT_ORDER',
        'ORDER_FOOD',
        'CONFIRM_ORDER',
        'place_order',
        'submit_order'
    ];
    public examples = examples;

    constructor(provider: UberEatsProvider) {
        this.provider = provider;
        elizaLogger.info('[✅ DOUBLE] RegisterOrderAction - Initialized');
    }

    async validate(
        _runtime: IAgentRuntime,
        message: { content: { text?: string; action?: string; orderDetails?: OrderDetails } }
    ): Promise<boolean> {
        elizaLogger.info('[🔄 DOUBLE] RegisterOrderAction - Validating request');

        if (!message.content.text && !message.content.orderDetails) {
            elizaLogger.error('[❌ DOUBLE] RegisterOrderAction - No order details provided');
            return false;
        }

        const isExplicitOrder = message.content.action === 'REGISTER_ORDER';
        const hasOrderKeywords = /place|order|submit|confirm|get|food/i.test(message.content.text || '');
        const hasOrderDetails = !!message.content.orderDetails;

        const isValid = isExplicitOrder || (hasOrderKeywords && hasOrderDetails);

        if (isValid) {
            elizaLogger.info('[✅ DOUBLE] RegisterOrderAction - Validation successful');
        } else {
            elizaLogger.error('[❌ DOUBLE] RegisterOrderAction - Validation failed');
        }

        return isValid;
    }

    async handler(
        runtime: IAgentRuntime,
        message: { content: { text: string; orderDetails?: OrderDetails } },
        state?: State,
        options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> {
        try {
            elizaLogger.info('[🔄 DOUBLE] RegisterOrderAction - Processing order request');

            if (!message.content.orderDetails) {
                elizaLogger.error('[❌ DOUBLE] RegisterOrderAction - No order details provided');
                return false;
            }

            const orderDetails = message.content.orderDetails;

            // Convert order details to UberEats format
            const order = {
                restaurantId: await this.provider.searchRestaurants(
                    orderDetails.restaurant.name,
                    orderDetails.deliveryAddress || ''
                ).then(restaurants => restaurants[0]?.id),
                items: orderDetails.items.map(item => ({
                    menuItemId: item.name,
                    quantity: item.quantity,
                    customizations: item.customizations?.map(c => ({
                        id: c.item,
                        selectedOptions: [c.type === 'add' ? 'add' : 'remove']
                    }))
                })),
                deliveryAddress: orderDetails.deliveryAddress,
                specialInstructions: orderDetails.pickupDetails ?
                    `Pickup at: ${orderDetails.pickupDetails.location}. Time: ${orderDetails.pickupDetails.preferredTime}` :
                    undefined
            };

            const result = await this.provider.placeOrder(order);

            if (callback) {
                const confirmation: OrderConfirmation = {
                    orderId: result.orderId,
                    status: 'CONFIRMED',
                    estimatedDelivery: result.estimatedDelivery,
                    paymentStatus: 'COMPLETED',
                    total: orderDetails.estimatedTotal
                };

                const responseText = orderDetails.deliveryAddress ?
                    `Order placed successfully! Your order will be delivered in approximately ${result.estimatedDelivery}.` :
                    `Order confirmed for pickup! Your order will be ready for pickup soon.`;

                callback({
                    text: responseText,
                    content: {
                        action: 'REGISTER_ORDER',
                        orderConfirmation: confirmation
                    }
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error('[❌ DOUBLE] RegisterOrderAction - Handler error:', error);
            return false;
        }
    }
}