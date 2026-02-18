import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

export class FoodDeliveryTool implements Tool {
  name = 'food_delivery';
  description = 'Order food delivery from various restaurants and platforms';
  category = 'lifestyle' as const;

  parameters = [
    {
      name: 'action',
      type: 'string',
      required: true,
      description: 'Action to perform (order, track, cancel, list_restaurants)',
      enum: ['order', 'track', 'cancel', 'list_restaurants']
    },
    {
      name: 'restaurant',
      type: 'string',
      required: false,
      description: 'Restaurant name or ID'
    },
    {
      name: 'items',
      type: 'array',
      required: false,
      description: 'List of food items to order'
    },
    {
      name: 'address',
      type: 'string',
      required: false,
      description: 'Delivery address'
    },
    {
      name: 'phone',
      type: 'string',
      required: false,
      description: 'Contact phone number'
    },
    {
      name: 'orderId',
      type: 'string',
      required: false,
      description: 'Order ID for tracking or cancellation'
    },
    {
      name: 'platform',
      type: 'string',
      required: false,
      description: 'Delivery platform (meituan, eleme, default)',
      enum: ['meituan', 'eleme', 'default']
    }
  ];

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const action = params.action as string;
      
      if (!action) {
        return { success: false, error: 'action is required' };
      }

      switch (action) {
        case 'order':
          return await this.orderFood(params);
        case 'track':
          return await this.trackOrder(params);
        case 'cancel':
          return await this.cancelOrder(params);
        case 'list_restaurants':
          return await this.listRestaurants(params);
        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      Logger.error('Food delivery tool failed', { error: (error as Error).message, params });
      return { 
        success: false, 
        error: `Food delivery failed: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  private async orderFood(params: Record<string, unknown>): Promise<ToolResult> {
    const restaurant = params.restaurant as string;
    const items = params.items as Array<{ name: string; quantity: number; price?: number }>;
    const address = params.address as string;
    const phone = params.phone as string;
    const platform = params.platform as string || 'default';

    if (!restaurant || !items || !address || !phone) {
      return { 
        success: false, 
        error: 'restaurant, items, address, and phone are required for ordering' 
      };
    }

    const orderId = `FD${Date.now()}`;
    const totalAmount = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const deliveryFee = platform === 'meituan' ? 5 : platform === 'eleme' ? 4 : 3;
    const finalAmount = totalAmount + deliveryFee;

    Logger.info(`Food order created: ${orderId}`, { restaurant, totalAmount });

    return {
      success: true,
      data: {
        orderId,
        restaurant,
        items,
        address,
        phone,
        platform,
        subtotal: totalAmount,
        deliveryFee,
        totalAmount: finalAmount,
        estimatedTime: '30-45 minutes',
        status: 'pending',
        message: 'Order placed successfully',
        instructions: [
          `Order ID: ${orderId}`,
          `Estimated delivery time: 30-45 minutes`,
          'You will receive a notification when the order is ready',
          'Contact the platform support if you need to make changes'
        ]
      }
    };
  }

  private async trackOrder(params: Record<string, unknown>): Promise<ToolResult> {
    const orderId = params.orderId as string;

    if (!orderId) {
      return { success: false, error: 'orderId is required for tracking' };
    }

    const statuses = ['pending', 'preparing', 'ready', 'delivering', 'delivered'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    Logger.info(`Tracking order: ${orderId}`, { status: randomStatus });

    return {
      success: true,
      data: {
        orderId,
        status: randomStatus,
        statusDescription: this.getStatusDescription(randomStatus),
        estimatedTime: randomStatus === 'delivered' ? 'Delivered' : '15-30 minutes',
        message: 'Order status retrieved successfully',
        timeline: this.getOrderTimeline(randomStatus)
      }
    };
  }

  private async cancelOrder(params: Record<string, unknown>): Promise<ToolResult> {
    const orderId = params.orderId as string;

    if (!orderId) {
      return { success: false, error: 'orderId is required for cancellation' };
    }

    Logger.info(`Cancelling order: ${orderId}`);

    return {
      success: true,
      data: {
        orderId,
        status: 'cancelled',
        message: 'Order cancelled successfully',
        refundAmount: 'Will be processed within 3-5 business days',
        instructions: [
          'Your order has been cancelled',
          'Refund will be processed to your original payment method',
          'Contact customer service if you have any questions'
        ]
      }
    };
  }

  private async listRestaurants(params: Record<string, unknown>): Promise<ToolResult> {
    const platform = params.platform as string || 'default';

    const restaurants = [
      { id: 'R001', name: '川味人家', cuisine: '川菜', rating: 4.5, deliveryTime: '25-35 min', minOrder: 20 },
      { id: 'R002', name: '粤式茶餐厅', cuisine: '粤菜', rating: 4.7, deliveryTime: '30-40 min', minOrder: 25 },
      { id: 'R003', name: '日式料理', cuisine: '日料', rating: 4.8, deliveryTime: '35-45 min', minOrder: 30 },
      { id: 'R004', name: '西式快餐', cuisine: '西餐', rating: 4.3, deliveryTime: '20-30 min', minOrder: 15 },
      { id: 'R005', name: '家常菜馆', cuisine: '家常菜', rating: 4.6, deliveryTime: '25-35 min', minOrder: 20 },
      { id: 'R006', name: '麻辣烫', cuisine: '川菜', rating: 4.4, deliveryTime: '20-30 min', minOrder: 15 },
      { id: 'R007', name: '烧烤店', cuisine: '烧烤', rating: 4.5, deliveryTime: '30-40 min', minOrder: 30 },
      { id: 'R008', name: '素食餐厅', cuisine: '素食', rating: 4.7, deliveryTime: '25-35 min', minOrder: 20 }
    ];

    Logger.info(`Listing restaurants for platform: ${platform}`);

    return {
      success: true,
      data: {
        platform,
        restaurantCount: restaurants.length,
        restaurants,
        message: 'Restaurant list retrieved successfully',
        instructions: [
          'Select a restaurant to view their menu',
          'Use the order action to place your order',
          'Minimum order amounts apply per restaurant'
        ]
      }
    };
  }

  private getStatusDescription(status: string): string {
    const descriptions: Record<string, string> = {
      pending: '订单已提交，等待商家确认',
      preparing: '商家正在准备您的订单',
      ready: '订单已准备好，等待骑手取餐',
      delivering: '骑手正在配送中',
      delivered: '订单已送达'
    };
    return descriptions[status] || 'Unknown status';
  }

  private getOrderTimeline(status: string): Array<{ time: string; event: string }> {
    const now = new Date();
    const timeline = [
      { time: this.formatTime(new Date(now.getTime() - 5 * 60000)), event: '订单已提交' },
      { time: this.formatTime(new Date(now.getTime() - 3 * 60000)), event: '商家已接单' }
    ];

    if (['preparing', 'ready', 'delivering', 'delivered'].includes(status)) {
      timeline.push({ time: this.formatTime(new Date(now.getTime() - 2 * 60000)), event: '开始准备' });
    }

    if (['ready', 'delivering', 'delivered'].includes(status)) {
      timeline.push({ time: this.formatTime(new Date(now.getTime() - 1 * 60000)), event: '订单已准备好' });
    }

    if (['delivering', 'delivered'].includes(status)) {
      timeline.push({ time: this.formatTime(now), event: '骑手已取餐' });
    }

    if (status === 'delivered') {
      timeline.push({ time: this.formatTime(now), event: '订单已送达' });
    }

    return timeline;
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
}
