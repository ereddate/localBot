import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

export class MovieTicketTool implements Tool {
  name = 'movie_ticket';
  description = 'Book movie tickets and manage movie bookings';
  category = 'lifestyle' as const;

  parameters = [
    {
      name: 'action',
      type: 'string',
      required: true,
      description: 'Action to perform (book, cancel, list_movies, list_theaters, get_showtimes)',
      enum: ['book', 'cancel', 'list_movies', 'list_theaters', 'get_showtimes']
    },
    {
      name: 'movieId',
      type: 'string',
      required: false,
      description: 'Movie ID for booking'
    },
    {
      name: 'theaterId',
      type: 'string',
      required: false,
      description: 'Theater ID'
    },
    {
      name: 'showtimeId',
      type: 'string',
      required: false,
      description: 'Showtime ID for booking'
    },
    {
      name: 'seatCount',
      type: 'number',
      required: false,
      description: 'Number of tickets'
    },
    {
      name: 'seatType',
      type: 'string',
      required: false,
      description: 'Seat type (standard, vip, imax, 3d)',
      enum: ['standard', 'vip', 'imax', '3d']
    },
    {
      name: 'phone',
      type: 'string',
      required: false,
      description: 'Contact phone number'
    },
    {
      name: 'bookingId',
      type: 'string',
      required: false,
      description: 'Booking ID for cancellation'
    },
    {
      name: 'city',
      type: 'string',
      required: false,
      description: 'City name'
    },
    {
      name: 'date',
      type: 'string',
      required: false,
      description: 'Date (e.g., "2026-02-19")'
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
          return await this.bookTicket(params);
        case 'cancel':
          return await this.cancelBooking(params);
        case 'list_movies':
          return await this.listMovies(params);
        case 'list_theaters':
          return await this.listTheaters(params);
        case 'get_showtimes':
          return await this.getShowtimes(params);
        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      Logger.error('Movie ticket tool failed', { error: (error as Error).message, params });
      return { 
        success: false, 
        error: `Movie ticket failed: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  private async bookTicket(params: Record<string, unknown>): Promise<ToolResult> {
    const movieId = params.movieId as string;
    const theaterId = params.theaterId as string;
    const showtimeId = params.showtimeId as string;
    const seatCount = params.seatCount as number || 1;
    const seatType = params.seatType as string || 'standard';
    const phone = params.phone as string;

    if (!movieId || !theaterId || !showtimeId || !phone) {
      return { 
        success: false, 
        error: 'movieId, theaterId, showtimeId, and phone are required for booking' 
      };
    }

    const bookingId = this.generateBookingId();
    const movie = this.getMovieById(movieId);
    const theater = this.getTheaterById(theaterId);
    const showtime = this.getShowtimeById(showtimeId);
    const totalPrice = this.calculatePrice(seatType, seatCount);

    Logger.info(`Movie ticket booked: ${bookingId}`, { movieId, theaterId, seatCount });

    return {
      success: true,
      data: {
        bookingId,
        movie,
        theater,
        showtime,
        seatCount,
        seatType,
        phone,
        totalPrice,
        status: 'confirmed',
        message: 'Movie ticket booked successfully',
        instructions: [
          `Booking ID: ${bookingId}`,
          `Movie: ${movie.title}`,
          `Theater: ${theater.name}`,
          `Showtime: ${showtime.time}`,
          `Seats: ${seatCount} x ${this.getSeatTypeName(seatType)}`,
          `Total: ¥${totalPrice}`,
          'Please arrive 15 minutes before showtime',
          'Show booking ID at the theater',
          'Contact theater if you need to make changes'
        ]
      }
    };
  }

  private async cancelBooking(params: Record<string, unknown>): Promise<ToolResult> {
    const bookingId = params.bookingId as string;

    if (!bookingId) {
      return { success: false, error: 'bookingId is required for cancellation' };
    }

    Logger.info(`Cancelling movie booking: ${bookingId}`);

    return {
      success: true,
      data: {
        bookingId,
        status: 'cancelled',
        message: 'Booking cancelled successfully',
        refundAmount: 'Will be processed within 3-5 business days',
        instructions: [
          'Your booking has been cancelled',
          'Refund will be processed to your original payment method',
          'Contact customer service if you have any questions'
        ]
      }
    };
  }

  private async listMovies(params: Record<string, unknown>): Promise<ToolResult> {
    const city = params.city as string || '全国';

    const movies = this.getAllMovies();

    Logger.info(`Listing movies for city: ${city}`);

    return {
      success: true,
      data: {
        city,
        movieCount: movies.length,
        movies,
        message: 'Movie list retrieved successfully',
        instructions: [
          'Browse the available movies',
          'Use list_theaters to find theaters near you',
          'Use get_showtimes to check available showtimes',
          'Use book action to purchase tickets'
        ]
      }
    };
  }

  private async listTheaters(params: Record<string, unknown>): Promise<ToolResult> {
    const city = params.city as string || '全国';

    const theaters = this.getAllTheaters();

    Logger.info(`Listing theaters for city: ${city}`);

    return {
      success: true,
      data: {
        city,
        theaterCount: theaters.length,
        theaters,
        message: 'Theater list retrieved successfully',
        instructions: [
          'Choose a theater near you',
          'Check theater facilities and features',
          'Use get_showtimes to check available movies and times',
          'Use book action to purchase tickets'
        ]
      }
    };
  }

  private async getShowtimes(params: Record<string, unknown>): Promise<ToolResult> {
    const movieId = params.movieId as string;
    const theaterId = params.theaterId as string;
    const date = params.date as string;

    if (!movieId || !theaterId) {
      return { 
        success: false, 
        error: 'movieId and theaterId are required for showtimes' 
      };
    }

    const movie = this.getMovieById(movieId);
    const theater = this.getTheaterById(theaterId);
    const showtimes = this.getShowtimesForMovieAndTheater(movieId, theaterId);

    Logger.info(`Getting showtimes for movie: ${movieId}, theater: ${theaterId}`);

    return {
      success: true,
      data: {
        movie,
        theater,
        date: date || '今天',
        showtimes,
        message: 'Showtimes retrieved successfully',
        instructions: [
          'Select a showtime that works for you',
          'Note the showtime ID for booking',
          'Use book action to purchase tickets',
          'Seats are subject to availability'
        ]
      }
    };
  }

  private getAllMovies(): Array<any> {
    return [
      {
        id: 'M001',
        title: '流浪地球3',
        genre: '科幻',
        duration: '125分钟',
        rating: 8.9,
        director: '郭帆',
        cast: ['吴京', '易烊千玺', '李雪健'],
        description: '人类面临太阳危机，开启流浪地球计划',
        releaseDate: '2026-02-10'
      },
      {
        id: 'M002',
        title: '满江红',
        genre: '古装',
        duration: '140分钟',
        rating: 8.5,
        director: '张艺谋',
        cast: ['沈腾', '易烊千玺', '张译'],
        description: '南宋绍兴年间，一场惊天阴谋',
        releaseDate: '2026-01-20'
      },
      {
        id: 'M003',
        title: '深海',
        genre: '动画',
        duration: '110分钟',
        rating: 8.7,
        director: '田晓鹏',
        cast: ['苏鑫', '王亭文'],
        description: '一个关于成长与救赎的奇幻故事',
        releaseDate: '2026-01-15'
      },
      {
        id: 'M004',
        title: '无名',
        genre: '动作',
        duration: '128分钟',
        rating: 8.3,
        director: '程耳',
        cast: ['梁朝伟', '王一博', '周迅'],
        description: '抗战时期的谍战故事',
        releaseDate: '2026-01-25'
      },
      {
        id: 'M005',
        title: '中国乒乓之绝地反击',
        genre: '体育',
        duration: '135分钟',
        rating: 8.1,
        director: '邓超',
        cast: ['邓超', '孙俪', '许魏洲'],
        description: '中国乒乓球队的奋斗历程',
        releaseDate: '2026-02-05'
      },
      {
        id: 'M006',
        title: '熊出没·伴我熊芯',
        genre: '动画',
        duration: '100分钟',
        rating: 8.4,
        director: '林永长',
        cast: ['谭笑', '张伟'],
        description: '熊出没系列最新作品',
        releaseDate: '2026-01-22'
      }
    ];
  }

  private getAllTheaters(): Array<any> {
    return [
      {
        id: 'T001',
        name: '万达影城',
        address: '朝阳区建国路93号',
        facilities: ['IMAX', '杜比全景声', 'VIP厅'],
        phone: '010-12345678'
      },
      {
        id: 'T002',
        name: '金逸影城',
        address: '海淀区中关村大街1号',
        facilities: ['IMAX', '4DX', 'VIP厅'],
        phone: '010-87654321'
      },
      {
        id: 'T003',
        name: '百老汇电影中心',
        address: '东城区王府井大街88号',
        facilities: ['杜比全景声', 'VIP厅'],
        phone: '010-11112222'
      },
      {
        id: 'T004',
        name: 'CGV影城',
        address: '朝阳区望京SOHO',
        facilities: ['IMAX', '4DX', 'VIP厅', 'SCREENX'],
        phone: '010-33334444'
      },
      {
        id: 'T005',
        name: '卢米埃影城',
        address: '西城区金融街',
        facilities: ['IMAX', '杜比全景声'],
        phone: '010-55556666'
      }
    ];
  }

  private getShowtimesForMovieAndTheater(movieId: string, theaterId: string): Array<any> {
    const baseTimes = ['10:30', '13:00', '15:30', '18:00', '20:30', '23:00'];
    const showtimes: Array<any> = [];

    baseTimes.forEach((time, index) => {
      showtimes.push({
        id: `S${movieId}${theaterId}${index + 1}`,
        time,
        availableSeats: Math.floor(Math.random() * 50) + 10,
        price: {
          standard: 45 + Math.floor(Math.random() * 20),
          vip: 80 + Math.floor(Math.random() * 30),
          imax: 70 + Math.floor(Math.random() * 30),
          '3d': 55 + Math.floor(Math.random() * 25)
        }
      });
    });

    return showtimes;
  }

  private getMovieById(movieId: string): any {
    const movies = this.getAllMovies();
    return movies.find(m => m.id === movieId) || movies[0];
  }

  private getTheaterById(theaterId: string): any {
    const theaters = this.getAllTheaters();
    return theaters.find(t => t.id === theaterId) || theaters[0];
  }

  private getShowtimeById(showtimeId: string): any {
    const movieId = showtimeId.substring(1, 4);
    const theaterId = showtimeId.substring(4, 7);
    const showtimes = this.getShowtimesForMovieAndTheater(movieId, theaterId);
    return showtimes.find(s => s.id === showtimeId) || showtimes[0];
  }

  private generateBookingId(): string {
    return `BK${Date.now().toString().slice(-8)}`;
  }

  private calculatePrice(seatType: string, seatCount: number): number {
    const basePrices: Record<string, number> = {
      standard: 50,
      vip: 90,
      imax: 80,
      '3d': 60
    };
    const basePrice = basePrices[seatType] || basePrices.standard;
    return basePrice * seatCount;
  }

  private getSeatTypeName(seatType: string): string {
    const names: Record<string, string> = {
      standard: '普通座',
      vip: 'VIP座',
      imax: 'IMAX',
      '3d': '3D'
    };
    return names[seatType] || '普通座';
  }
}
