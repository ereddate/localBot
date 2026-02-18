import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

export class CourierServiceTool implements Tool {
  name = 'courier_service';
  description = 'Schedule courier pickup and delivery services';
  category = 'lifestyle' as const;

  parameters = [
    {
      name: 'action',
      type: 'string',
      required: true,
      description: 'Action to perform (schedule, track, cancel, get_quote, list_services)',
      enum: ['schedule', 'track', 'cancel', 'get_quote', 'list_services']
    },
    {
      name: 'service',
      type: 'string',
      required: false,
      description: 'Courier service provider (sf, zto, yto, sto, ems, default)',
      enum: ['sf', 'zto', 'yto', 'sto', 'ems', 'default']
    },
    {
      name: 'senderName',
      type: 'string',
      required: false,
      description: 'Sender name'
    },
    {
      name: 'senderPhone',
      type: 'string',
      required: false,
      description: 'Sender phone number'
    },
    {
      name: 'senderAddress',
      type: 'string',
      required: false,
      description: 'Sender pickup address'
    },
    {
      name: 'receiverName',
      type: 'string',
      required: false,
      description: 'Receiver name'
    },
    {
      name: 'receiverPhone',
      type: 'string',
      required: false,
      description: 'Receiver phone number'
    },
    {
      name: 'receiverAddress',
      type: 'string',
      required: false,
      description: 'Receiver delivery address'
    },
    {
      name: 'packageWeight',
      type: 'number',
      required: false,
      description: 'Package weight in kg'
    },
    {
      name: 'packageType',
      type: 'string',
      required: false,
      description: 'Package type (document, small, medium, large, fragile)',
      enum: ['document', 'small', 'medium', 'large', 'fragile']
    },
    {
      name: 'trackingNumber',
      type: 'string',
      required: false,
      description: 'Tracking number for tracking or cancellation'
    },
    {
      name: 'pickupTime',
      type: 'string',
      required: false,
      description: 'Preferred pickup time (e.g., "2026-02-19 14:00")'
    }
  ];

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const action = params.action as string;
      
      if (!action) {
        return { success: false, error: 'action is required' };
      }

      switch (action) {
        case 'schedule':
          return await this.schedulePickup(params);
        case 'track':
          return await this.trackPackage(params);
        case 'cancel':
          return await this.cancelShipment(params);
        case 'get_quote':
          return await this.getQuote(params);
        case 'list_services':
          return await this.listServices(params);
        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      Logger.error('Courier service tool failed', { error: (error as Error).message, params });
      return { 
        success: false, 
        error: `Courier service failed: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  private async schedulePickup(params: Record<string, unknown>): Promise<ToolResult> {
    const service = params.service as string || 'default';
    const senderName = params.senderName as string;
    const senderPhone = params.senderPhone as string;
    const senderAddress = params.senderAddress as string;
    const receiverName = params.receiverName as string;
    const receiverPhone = params.receiverPhone as string;
    const receiverAddress = params.receiverAddress as string;
    const packageWeight = params.packageWeight as number;
    const packageType = params.packageType as string || 'medium';
    const pickupTime = params.pickupTime as string;

    if (!senderName || !senderPhone || !senderAddress || 
        !receiverName || !receiverPhone || !receiverAddress) {
      return { 
        success: false, 
        error: 'Sender and receiver information (name, phone, address) are required' 
      };
    }

    const trackingNumber = this.generateTrackingNumber(service);
    const estimatedCost = this.calculateCost(packageWeight || 1, packageType, service);
    const estimatedDelivery = this.getEstimatedDelivery(service);

    Logger.info(`Courier pickup scheduled: ${trackingNumber}`, { service, estimatedCost });

    return {
      success: true,
      data: {
        trackingNumber,
        service,
        serviceNames: this.getServiceName(service),
        sender: { name: senderName, phone: senderPhone, address: senderAddress },
        receiver: { name: receiverName, phone: receiverPhone, address: receiverAddress },
        package: { weight: packageWeight || 1, type: packageType },
        pickupTime: pickupTime || 'ASAP',
        estimatedCost,
        estimatedDelivery,
        status: 'scheduled',
        message: 'Courier pickup scheduled successfully',
        instructions: [
          `Tracking Number: ${trackingNumber}`,
          `Estimated delivery: ${estimatedDelivery}`,
          `Estimated cost: ¥${estimatedCost}`,
          'Courier will contact you before pickup',
          'Ensure package is ready and properly packaged',
          'Keep tracking number for future reference'
        ]
      }
    };
  }

  private async trackPackage(params: Record<string, unknown>): Promise<ToolResult> {
    const trackingNumber = params.trackingNumber as string;

    if (!trackingNumber) {
      return { success: false, error: 'trackingNumber is required for tracking' };
    }

    const trackingInfo = this.getMockTrackingInfo(trackingNumber);

    Logger.info(`Tracking package: ${trackingNumber}`, { status: trackingInfo.status });

    return {
      success: true,
      data: {
        trackingNumber,
        status: trackingInfo.status,
        statusDescription: this.getTrackingStatusDescription(trackingInfo.status),
        currentLocation: trackingInfo.currentLocation,
        estimatedDelivery: trackingInfo.estimatedDelivery,
        timeline: trackingInfo.timeline,
        message: 'Tracking information retrieved successfully'
      }
    };
  }

  private async cancelShipment(params: Record<string, unknown>): Promise<ToolResult> {
    const trackingNumber = params.trackingNumber as string;

    if (!trackingNumber) {
      return { success: false, error: 'trackingNumber is required for cancellation' };
    }

    Logger.info(`Cancelling shipment: ${trackingNumber}`);

    return {
      success: true,
      data: {
        trackingNumber,
        status: 'cancelled',
        message: 'Shipment cancelled successfully',
        refundAmount: 'Will be processed within 3-5 business days',
        instructions: [
          'Your shipment has been cancelled',
          'Refund will be processed to your original payment method',
          'Contact customer service if you have any questions'
        ]
      }
    };
  }

  private async getQuote(params: Record<string, unknown>): Promise<ToolResult> {
    const service = params.service as string || 'default';
    const packageWeight = params.packageWeight as number || 1;
    const packageType = params.packageType as string || 'medium';

    const quotes = [
      { service: 'sf', name: '顺丰速运', cost: this.calculateCost(packageWeight, packageType, 'sf'), time: '1-2天' },
      { service: 'zto', name: '中通快递', cost: this.calculateCost(packageWeight, packageType, 'zto'), time: '2-3天' },
      { service: 'yto', name: '圆通速递', cost: this.calculateCost(packageWeight, packageType, 'yto'), time: '2-3天' },
      { service: 'sto', name: '申通快递', cost: this.calculateCost(packageWeight, packageType, 'sto'), time: '2-3天' },
      { service: 'ems', name: 'EMS', cost: this.calculateCost(packageWeight, packageType, 'ems'), time: '1-3天' }
    ];

    Logger.info(`Getting quotes for package: ${packageWeight}kg, ${packageType}`);

    return {
      success: true,
      data: {
        package: { weight: packageWeight, type: packageType },
        quotes,
        recommended: quotes[0],
        message: 'Quotes retrieved successfully',
        instructions: [
          'Compare prices and delivery times',
          'Select the service that best meets your needs',
          'Use schedule action to book your chosen service'
        ]
      }
    };
  }

  private async listServices(params: Record<string, unknown>): Promise<ToolResult> {
    const services = [
      { 
        service: 'sf', 
        name: '顺丰速运', 
        description: '快速、可靠、覆盖全国', 
        features: ['次日达', '上门取件', '实时追踪'],
        basePrice: 12,
        deliveryTime: '1-2天'
      },
      { 
        service: 'zto', 
        name: '中通快递', 
        description: '性价比高，适合普通包裹', 
        features: ['价格优惠', '网点覆盖广', '上门取件'],
        basePrice: 8,
        deliveryTime: '2-3天'
      },
      { 
        service: 'yto', 
        name: '圆通速递', 
        description: '稳定可靠，服务范围广', 
        features: ['价格合理', '服务稳定', '上门取件'],
        basePrice: 8,
        deliveryTime: '2-3天'
      },
      { 
        service: 'sto', 
        name: '申通快递', 
        description: '经济实惠，适合日常寄送', 
        features: ['价格低廉', '服务便捷', '上门取件'],
        basePrice: 7,
        deliveryTime: '2-3天'
      },
      { 
        service: 'ems', 
        name: 'EMS', 
        description: '官方邮政，覆盖偏远地区', 
        features: ['覆盖全国', '偏远可达', '官方保障'],
        basePrice: 15,
        deliveryTime: '1-3天'
      }
    ];

    Logger.info('Listing courier services');

    return {
      success: true,
      data: {
        services,
        message: 'Courier services listed successfully',
        instructions: [
          'Choose a service based on your needs',
          'Consider delivery time, cost, and service features',
          'Use get_quote to compare prices for your package'
        ]
      }
    };
  }

  private generateTrackingNumber(service: string): string {
    const prefixes: Record<string, string> = {
      sf: 'SF',
      zto: 'ZTO',
      yto: 'YT',
      sto: 'ST',
      ems: 'EA'
    };
    const prefix = prefixes[service] || 'CN';
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}${random}${Date.now().toString().slice(-4)}`;
  }

  private calculateCost(weight: number, type: string, service: string): number {
    const basePrices: Record<string, number> = {
      sf: 12,
      zto: 8,
      yto: 8,
      sto: 7,
      ems: 15,
      default: 10
    };

    const typeMultipliers: Record<string, number> = {
      document: 0.5,
      small: 0.8,
      medium: 1,
      large: 1.5,
      fragile: 2
    };

    const basePrice = basePrices[service] || basePrices.default;
    const typeMultiplier = typeMultipliers[type] || 1;
    const weightMultiplier = Math.max(1, weight);

    return Math.round(basePrice * typeMultiplier * weightMultiplier);
  }

  private getEstimatedDelivery(service: string): string {
    const deliveryTimes: Record<string, string> = {
      sf: '1-2天',
      zto: '2-3天',
      yto: '2-3天',
      sto: '2-3天',
      ems: '1-3天',
      default: '2-3天'
    };
    return deliveryTimes[service] || deliveryTimes.default;
  }

  private getServiceName(service: string): string {
    const names: Record<string, string> = {
      sf: '顺丰速运',
      zto: '中通快递',
      yto: '圆通速递',
      sto: '申通快递',
      ems: 'EMS',
      default: '默认快递'
    };
    return names[service] || names.default;
  }

  private getMockTrackingInfo(trackingNumber: string): any {
    const statuses = ['picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const locations = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉'];
    const currentLocation = locations[Math.floor(Math.random() * locations.length)];

    return {
      status: randomStatus,
      currentLocation,
      estimatedDelivery: randomStatus === 'delivered' ? '已送达' : '2-3天',
      timeline: this.getTrackingTimeline(randomStatus)
    };
  }

  private getTrackingStatusDescription(status: string): string {
    const descriptions: Record<string, string> = {
      picked_up: '快递员已取件',
      in_transit: '运输中',
      out_for_delivery: '派送中',
      delivered: '已送达'
    };
    return descriptions[status] || 'Unknown status';
  }

  private getTrackingTimeline(status: string): Array<{ time: string; event: string; location: string }> {
    const now = new Date();
    const timeline = [
      { time: this.formatTime(new Date(now.getTime() - 24 * 60 * 60000)), event: '订单已创建', location: '系统' },
      { time: this.formatTime(new Date(now.getTime() - 23 * 60 * 60000)), event: '快递员已取件', location: '发件地' }
    ];

    if (['in_transit', 'out_for_delivery', 'delivered'].includes(status)) {
      timeline.push({ time: this.formatTime(new Date(now.getTime() - 12 * 60 * 60000)), event: '到达中转站', location: '中转站' });
    }

    if (['out_for_delivery', 'delivered'].includes(status)) {
      timeline.push({ time: this.formatTime(new Date(now.getTime() - 2 * 60 * 60000)), event: '到达目的地', location: '目的地' });
    }

    if (status === 'delivered') {
      timeline.push({ time: this.formatTime(now), event: '已签收', location: '收件地' });
    }

    return timeline;
  }

  private formatTime(date: Date): string {
    return date.toLocaleString('zh-CN', { 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
