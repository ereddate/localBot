import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

export class RideHailingTool implements Tool {
  name = 'ride_hailing';
  description = 'Book and manage ride-hailing services (taxi, ride-share, etc.)';
  category = 'lifestyle' as const;

  parameters = [
    {
      name: 'action',
      type: 'string',
      required: true,
      description: 'Action to perform (book, track, cancel, estimate, list_services)',
      enum: ['book', 'track', 'cancel', 'estimate', 'list_services']
    },
    {
      name: 'service',
      type: 'string',
      required: false,
      description: 'Ride-hailing service (didi, didi_premium, didi_luxury, taxi, default)',
      enum: ['didi', 'didi_premium', 'didi_luxury', 'taxi', 'default']
    },
    {
      name: 'pickupAddress',
      type: 'string',
      required: false,
      description: 'Pickup address'
    },
    {
      name: 'destinationAddress',
      type: 'string',
      required: false,
      description: 'Destination address'
    },
    {
      name: 'pickupTime',
      type: 'string',
      required: false,
      description: 'Pickup time (e.g., "2026-02-19 14:00" or "now")'
    },
    {
      name: 'passengerCount',
      type: 'number',
      required: false,
      description: 'Number of passengers'
    },
    {
      name: 'rideId',
      type: 'string',
      required: false,
      description: 'Ride ID for tracking or cancellation'
    },
    {
      name: 'phone',
      type: 'string',
      required: false,
      description: 'Contact phone number'
    }
  ];

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const action = params.action as string;
      
      if (!action) {
        return { success: false, error: 'action is required' };
      }

      switch (action) {
        case 'book':
          return await this.bookRide(params);
        case 'track':
          return await this.trackRide(params);
        case 'cancel':
          return await this.cancelRide(params);
        case 'estimate':
          return await this.estimateRide(params);
        case 'list_services':
          return await this.listServices(params);
        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      Logger.error('Ride hailing tool failed', { error: (error as Error).message, params });
      return { 
        success: false, 
        error: `Ride hailing failed: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  private async bookRide(params: Record<string, unknown>): Promise<ToolResult> {
    const service = params.service as string || 'default';
    const pickupAddress = params.pickupAddress as string;
    const destinationAddress = params.destinationAddress as string;
    const pickupTime = params.pickupTime as string || 'now';
    const passengerCount = params.passengerCount as number || 1;
    const phone = params.phone as string;

    if (!pickupAddress || !destinationAddress) {
      return { 
        success: false, 
        error: 'pickupAddress and destinationAddress are required for booking' 
      };
    }

    const rideId = this.generateRideId();
    const estimatedFare = this.calculateFare(service, pickupAddress, destinationAddress);
    const estimatedArrival = this.getEstimatedArrival(service, pickupTime);
    const driverInfo = this.getMockDriverInfo(service);

    Logger.info(`Ride booked: ${rideId}`, { service, pickupAddress, destinationAddress });

    return {
      success: true,
      data: {
        rideId,
        service,
        serviceName: this.getServiceName(service),
        pickupAddress,
        destinationAddress,
        pickupTime: pickupTime === 'now' ? '立即出发' : pickupTime,
        passengerCount,
        phone,
        estimatedFare,
        estimatedArrival,
        driver: driverInfo,
        status: 'confirmed',
        message: 'Ride booked successfully',
        instructions: [
          `Ride ID: ${rideId}`,
          `Estimated arrival: ${estimatedArrival}`,
          `Estimated fare: ¥${estimatedFare}`,
          `Driver: ${driverInfo.name} (${driverInfo.car} - ${driverInfo.plateNumber})`,
          'Driver will contact you shortly',
          'Please be ready at pickup location',
          'Use track action to monitor your ride'
        ]
      }
    };
  }

  private async trackRide(params: Record<string, unknown>): Promise<ToolResult> {
    const rideId = params.rideId as string;

    if (!rideId) {
      return { success: false, error: 'rideId is required for tracking' };
    }

    const trackingInfo = this.getMockTrackingInfo(rideId);

    Logger.info(`Tracking ride: ${rideId}`, { status: trackingInfo.status });

    return {
      success: true,
      data: {
        rideId,
        status: trackingInfo.status,
        statusDescription: this.getRideStatusDescription(trackingInfo.status),
        driver: trackingInfo.driver,
        currentLocation: trackingInfo.currentLocation,
        estimatedArrival: trackingInfo.estimatedArrival,
        distanceRemaining: trackingInfo.distanceRemaining,
        message: 'Ride tracking information retrieved',
        instructions: [
          'Driver is on the way',
          'Keep your phone accessible',
          'Contact driver if needed'
        ]
      }
    };
  }

  private async cancelRide(params: Record<string, unknown>): Promise<ToolResult> {
    const rideId = params.rideId as string;

    if (!rideId) {
      return { success: false, error: 'rideId is required for cancellation' };
    }

    Logger.info(`Cancelling ride: ${rideId}`);

    return {
      success: true,
      data: {
        rideId,
        status: 'cancelled',
        message: 'Ride cancelled successfully',
        cancellationFee: 'No cancellation fee (cancelled before pickup)',
        instructions: [
          'Your ride has been cancelled',
          'No charges have been applied',
          'You can book a new ride anytime'
        ]
      }
    };
  }

  private async estimateRide(params: Record<string, unknown>): Promise<ToolResult> {
    const service = params.service as string || 'default';
    const pickupAddress = params.pickupAddress as string;
    const destinationAddress = params.destinationAddress as string;

    if (!pickupAddress || !destinationAddress) {
      return { 
        success: false, 
        error: 'pickupAddress and destinationAddress are required for estimation' 
      };
    }

    const estimates = [
      { 
        service: 'didi', 
        name: '滴滴快车', 
        fare: this.calculateFare('didi', pickupAddress, destinationAddress), 
        arrival: '3-5分钟',
        features: ['经济实惠', '快速响应']
      },
      { 
        service: 'didi_premium', 
        name: '滴滴专车', 
        fare: this.calculateFare('didi_premium', pickupAddress, destinationAddress), 
        arrival: '2-4分钟',
        features: ['舒适体验', '优质司机']
      },
      { 
        service: 'didi_luxury', 
        name: '滴滴豪华车', 
        fare: this.calculateFare('didi_luxury', pickupAddress, destinationAddress), 
        arrival: '5-8分钟',
        features: ['高端车型', '尊贵服务']
      },
      { 
        service: 'taxi', 
        name: '出租车', 
        fare: this.calculateFare('taxi', pickupAddress, destinationAddress), 
        arrival: '5-10分钟',
        features: ['传统服务', '路边招手']
      }
    ];

    Logger.info(`Getting ride estimates: ${pickupAddress} -> ${destinationAddress}`);

    return {
      success: true,
      data: {
        pickupAddress,
        destinationAddress,
        estimates,
        recommended: estimates[0],
        message: 'Ride estimates retrieved successfully',
        instructions: [
          'Compare different service options',
          'Choose based on price, arrival time, and features',
          'Use book action to reserve your chosen service'
        ]
      }
    };
  }

  private async listServices(params: Record<string, unknown>): Promise<ToolResult> {
    const services = [
      { 
        service: 'didi', 
        name: '滴滴快车', 
        description: '经济实惠的出行选择', 
        baseFare: 10,
        features: ['价格优惠', '快速响应', '覆盖广泛'],
        vehicleTypes: ['经济型轿车', '紧凑型轿车']
      },
      { 
        service: 'didi_premium', 
        name: '滴滴专车', 
        description: '舒适专享的出行体验', 
        baseFare: 20,
        features: ['舒适体验', '优质司机', '车内整洁'],
        vehicleTypes: ['中型轿车', 'SUV']
      },
      { 
        service: 'didi_luxury', 
        name: '滴滴豪华车', 
        description: '高端豪华的出行服务', 
        baseFare: 50,
        features: ['高端车型', '尊贵服务', '专属司机'],
        vehicleTypes: ['豪华轿车', '商务车']
      },
      { 
        service: 'taxi', 
        name: '出租车', 
        description: '传统的出租车服务', 
        baseFare: 13,
        features: ['传统服务', '路边招手', '计价器'],
        vehicleTypes: ['出租车']
      }
    ];

    Logger.info('Listing ride-hailing services');

    return {
      success: true,
      data: {
        services,
        message: 'Ride-hailing services listed successfully',
        instructions: [
          'Choose a service based on your needs and budget',
          'Consider vehicle type and service features',
          'Use estimate to compare prices for your route'
        ]
      }
    };
  }

  private generateRideId(): string {
    return `RH${Date.now().toString().slice(-8)}`;
  }

  private calculateFare(service: string, pickup: string, destination: string): number {
    const baseFares: Record<string, number> = {
      didi: 10,
      didi_premium: 20,
      didi_luxury: 50,
      taxi: 13,
      default: 15
    };

    const distanceMultiplier = 1 + Math.random() * 0.5;
    const timeMultiplier = 1 + Math.random() * 0.3;

    const baseFare = baseFares[service] || baseFares.default;
    return Math.round(baseFare * distanceMultiplier * timeMultiplier);
  }

  private getEstimatedArrival(service: string, pickupTime: string): string {
    if (pickupTime === 'now') {
      const arrivalTimes: Record<string, string> = {
        didi: '3-5分钟',
        didi_premium: '2-4分钟',
        didi_luxury: '5-8分钟',
        taxi: '5-10分钟',
        default: '3-5分钟'
      };
      return arrivalTimes[service] || arrivalTimes.default;
    } else {
      return pickupTime;
    }
  }

  private getServiceName(service: string): string {
    const names: Record<string, string> = {
      didi: '滴滴快车',
      didi_premium: '滴滴专车',
      didi_luxury: '滴滴豪华车',
      taxi: '出租车',
      default: '默认服务'
    };
    return names[service] || names.default;
  }

  private getMockDriverInfo(service: string): any {
    const drivers = [
      { name: '张师傅', phone: '138****1234', car: '白色大众', plateNumber: '京A·12345', rating: 4.8 },
      { name: '李师傅', phone: '139****5678', car: '黑色丰田', plateNumber: '京B·67890', rating: 4.9 },
      { name: '王师傅', phone: '137****9012', car: '银色本田', plateNumber: '京C·13579', rating: 4.7 },
      { name: '赵师傅', phone: '136****3456', car: '蓝色别克', plateNumber: '京D·24680', rating: 4.8 }
    ];
    return drivers[Math.floor(Math.random() * drivers.length)];
  }

  private getMockTrackingInfo(rideId: string): any {
    const statuses = ['driver_assigned', 'driver_arriving', 'driver_arrived', 'in_transit', 'arrived'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const locations = ['距离您1.2公里', '距离您0.5公里', '已到达上车点', '距离目的地3.5公里', '已到达目的地'];
    const currentLocation = locations[statuses.indexOf(randomStatus)];

    const driver = this.getMockDriverInfo('default');

    return {
      status: randomStatus,
      currentLocation,
      estimatedArrival: randomStatus === 'arrived' ? '已到达' : '5-10分钟',
      distanceRemaining: randomStatus === 'in_transit' ? '3.5公里' : '0公里',
      driver
    };
  }

  private getRideStatusDescription(status: string): string {
    const descriptions: Record<string, string> = {
      driver_assigned: '司机已接单，正在前往',
      driver_arriving: '司机正在前往接您',
      driver_arrived: '司机已到达，请上车',
      in_transit: '行程中',
      arrived: '已到达目的地'
    };
    return descriptions[status] || 'Unknown status';
  }
}
