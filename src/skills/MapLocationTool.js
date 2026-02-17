"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapLocationTool = void 0;
const Logger_1 = require("../utils/Logger");
class MapLocationTool {
    constructor() {
        this.name = 'map_location_service';
        this.description = '地图和位置服务，提供地理位置查询、距离计算等功能';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const location = params.location;
            const destination = params.destination;
            const lat = params.lat ? parseFloat(params.lat) : null;
            const lng = params.lng ? parseFloat(params.lng) : null;
            if (!operation) {
                return { success: false, error: 'Operation is required. Available operations: geocode, reverse_geocode, distance, directions' };
            }
            switch (operation.toLowerCase()) {
                case 'geocode':
                    if (!location) {
                        return { success: false, error: 'Location name is required for geocoding' };
                    }
                    return this.geocode(location);
                case 'reverse_geocode':
                    if (lat === null || lng === null) {
                        return { success: false, error: 'Latitude and longitude are required for reverse geocoding' };
                    }
                    return this.reverseGeocode(lat, lng);
                case 'distance':
                    if (!location || !destination) {
                        return { success: false, error: 'Both origin and destination are required for distance calculation' };
                    }
                    return this.calculateDistance(location, destination);
                case 'directions':
                    if (!location || !destination) {
                        return { success: false, error: 'Both origin and destination are required for directions' };
                    }
                    return this.getDirections(location, destination);
                default:
                    return { success: false, error: `Unsupported operation: ${operation}. Available operations: geocode, reverse_geocode, distance, directions` };
            }
        }
        catch (error) {
            Logger_1.Logger.error('Map location tool error', { error: error.message });
            return { success: false, error: `Failed to execute map location service: ${error.message}` };
        }
    }
    async geocode(location) {
        // 模拟地理编码 - 实际应用中这里会调用真实地图API
        const mockLocations = {
            'beijing': { lat: 39.9042, lng: 116.4074, address: '北京市' },
            'shanghai': { lat: 31.2304, lng: 121.4737, address: '上海市' },
            'guangzhou': { lat: 23.1291, lng: 113.2644, address: '广州市' },
            'shenzhen': { lat: 22.5431, lng: 114.0579, address: '深圳市' },
            'hangzhou': { lat: 30.2741, lng: 120.1551, address: '杭州市' },
            'nanjing': { lat: 32.0603, lng: 118.7969, address: '南京市' },
            'chengdu': { lat: 30.5728, lng: 104.0668, address: '成都市' },
            'wuhan': { lat: 30.5928, lng: 114.3055, address: '武汉市' },
            'tianjin': { lat: 39.3434, lng: 117.3616, address: '天津市' },
            'chongqing': { lat: 29.5637, lng: 106.5505, address: '重庆市' },
            'home': { lat: 39.9042, lng: 116.4074, address: '我的家' },
            'office': { lat: 39.9139, lng: 116.3917, address: '办公室' },
            'airport': { lat: 39.5789, lng: 116.5943, address: '北京首都国际机场' }
        };
        const normalizedLocation = location.toLowerCase().replace(/\s+/g, '');
        const foundLocation = mockLocations[normalizedLocation] || {
            lat: 39.9042 + (Math.random() * 0.1 - 0.05),
            lng: 116.4074 + (Math.random() * 0.1 - 0.05),
            address: location
        };
        return {
            success: true,
            data: {
                location,
                coordinates: {
                    latitude: foundLocation.lat,
                    longitude: foundLocation.lng
                },
                address: foundLocation.address,
                accuracy: 'high'
            }
        };
    }
    async reverseGeocode(lat, lng) {
        // 模拟逆地理编码
        const locations = [
            { name: '北京市中心', area: 'Downtown Beijing', country: 'China', lat_range: [39.85, 40.05], lng_range: [116.35, 116.55] },
            { name: '上海市中心', area: 'Downtown Shanghai', country: 'China', lat_range: [31.18, 31.28], lng_range: [121.42, 121.52] },
            { name: '广州市中心', area: 'Downtown Guangzhou', country: 'China', lat_range: [23.08, 23.18], lng_range: [113.21, 113.31] },
            { name: '购物中心', area: 'Commercial District', country: 'China', lat_range: [39.90, 39.92], lng_range: [116.40, 116.42] },
            { name: '公园', area: 'Residential Area', country: 'China', lat_range: [39.89, 39.91], lng_range: [116.39, 116.41] },
            { name: '学校', area: 'Educational District', country: 'China', lat_range: [39.91, 39.93], lng_range: [116.38, 116.40] }
        ];
        const foundLocation = locations.find(loc => lat >= loc.lat_range[0] && lat <= loc.lat_range[1] &&
            lng >= loc.lng_range[0] && lng <= loc.lng_range[1]);
        const result = foundLocation || {
            name: `未知位置 (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            area: 'Unknown Area',
            country: 'China',
            lat_range: [lat, lat],
            lng_range: [lng, lng]
        };
        return {
            success: true,
            data: {
                coordinates: { latitude: lat, longitude: lng },
                address: `${result.area}, ${result.name}, ${result.country}`,
                locationDetails: result
            }
        };
    }
    async calculateDistance(origin, destination) {
        // 模拟距离计算
        const originLoc = await this.geocode(origin);
        const destLoc = await this.geocode(destination);
        if (!originLoc.success || !destLoc.success || !originLoc.data || !destLoc.data) {
            return { success: false, error: 'Could not geocode one or both locations' };
        }
        // 使用 Haversine 公式计算距离（简化版）
        const o = originLoc.data.coordinates;
        const d = destLoc.data.coordinates;
        const R = 6371; // 地球半径（公里）
        const dLat = this.toRadians(d.latitude - o.latitude);
        const dLon = this.toRadians(d.longitude - o.longitude);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(o.latitude)) * Math.cos(this.toRadians(d.latitude)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // 距离（公里）
        // 随机添加一些变化以模拟真实交通距离
        const trafficFactor = 0.8 + Math.random() * 0.6; // 0.8-1.4之间的随机因子
        const travelDistance = distance * trafficFactor;
        const estimatedTime = travelDistance / 40; // 假设平均速度40km/h
        return {
            success: true,
            data: {
                origin: origin,
                destination: destination,
                straightLineDistance: parseFloat(distance.toFixed(2)),
                travelDistance: parseFloat(travelDistance.toFixed(2)),
                estimatedTravelTime: parseFloat(estimatedTime.toFixed(2)), // 小时
                estimatedTravelMinutes: Math.round(estimatedTime * 60),
                unit: 'kilometers'
            }
        };
    }
    async getDirections(origin, destination) {
        const distanceResult = await this.calculateDistance(origin, destination);
        if (!distanceResult.success || !distanceResult.data) {
            return distanceResult;
        }
        const distanceData = distanceResult.data;
        // 生成模拟路线指引
        const directions = [
            `从 ${origin} 出发`,
            '向前行驶 500 米',
            '右转进入主路',
            `沿主路行驶约 ${Math.round(distanceData.travelDistance / 2)} 公里`,
            `左转到达 ${destination}`
        ];
        return {
            success: true,
            data: {
                origin: origin,
                destination: destination,
                ...distanceData,
                directions: directions,
                routeSummary: `从 ${origin} 到 ${destination} 的路线，总距离约 ${distanceData.travelDistance} 公里，预计行驶时间约 ${distanceData.estimatedTravelMinutes} 分钟`
            }
        };
    }
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
}
exports.MapLocationTool = MapLocationTool;
