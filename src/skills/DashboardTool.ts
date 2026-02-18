import { Tool, ToolResult } from '../types';

export class DashboardTool implements Tool {
  name = 'dashboard_tool';
  category = 'other' as const;
  description = 'Creates and manages interactive dashboards with multiple visualizations and metrics.';
  parameters = {
    type: 'object',
    properties: {
      dashboardName: {
        type: 'string',
        description: 'Name of the dashboard'
      },
      widgets: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string', enum: ['chart', 'metric', 'table', 'text', 'filter'] },
            position: {
              type: 'object',
              properties: {
                x: { type: 'number' },
                y: { type: 'number' },
                width: { type: 'number' },
                height: { type: 'number' }
              }
            },
            config: { type: 'object' }
          }
        },
        description: 'Widgets to include in the dashboard'
      },
      refreshInterval: {
        type: 'number',
        description: 'Auto-refresh interval in seconds'
      },
      permissions: {
        type: 'object',
        description: 'Access permissions for the dashboard'
      }
    },
    required: ['dashboardName', 'widgets']
  };

  async execute(params: any): Promise<any> {
    try {
      const { dashboardName, widgets, refreshInterval, permissions } = params;
      
      if (!Array.isArray(widgets) || widgets.length === 0) {
        throw new Error('Widgets must be a non-empty array');
      }
      
      return this.createDashboard(dashboardName, widgets, refreshInterval, permissions);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: `Failed to create dashboard: ${errorMessage}` };
    }
  }

  private async createDashboard(
    dashboardName: string,
    widgets: any[],
    refreshInterval?: number,
    permissions?: any
  ): Promise<any> {
    const startTime = new Date();
    
    // Process and validate widgets
    const processedWidgets = this.processWidgets(widgets);
    
    // Create dashboard layout
    const layout = this.generateLayout(processedWidgets);
    
    // Generate dashboard configuration
    const dashboardConfig = {
      id: this.generateId(),
      name: dashboardName,
      description: `Dashboard: ${dashboardName}`,
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      widgets: processedWidgets,
      layout: layout,
      theme: 'light',
      refreshInterval: refreshInterval || 300, // Default to 5 minutes
      permissions: permissions || { read: ['all'], write: ['admin'] },
      status: 'active'
    };
    
    const endTime = new Date();
    
    return {
      dashboardCreationResult: {
        dashboard: dashboardConfig,
        widgetCount: processedWidgets.length,
        totalLayoutArea: layout.totalArea,
        executionTimeMs: endTime.getTime() - startTime.getTime(),
        status: 'success'
      }
    };
  }

  private processWidgets(widgets: any[]): any[] {
    return widgets.map((widget, index) => {
      // Validate widget type
      const supportedTypes = ['chart', 'metric', 'table', 'text', 'filter'];
      const widgetType = widget.type || 'chart';
      
      if (!supportedTypes.includes(widgetType)) {
        throw new Error(`Unsupported widget type: ${widgetType}`);
      }
      
      // Generate widget ID if not provided
      const widgetId = widget.id || `widget_${index}_${Date.now()}`;
      
      // Process widget configuration based on type
      let processedConfig = { ...widget.config };
      
      // Add default configurations based on widget type
      switch(widgetType) {
        case 'metric':
          processedConfig = {
            value: processedConfig.value || 0,
            title: processedConfig.title || 'Metric',
            trend: processedConfig.trend || 'neutral',
            ...processedConfig
          };
          break;
          
        case 'chart':
          processedConfig = {
            type: processedConfig.chartType || 'bar',
            data: processedConfig.data || [],
            ...processedConfig
          };
          break;
          
        case 'table':
          processedConfig = {
            columns: processedConfig.columns || [],
            data: processedConfig.data || [],
            ...processedConfig
          };
          break;
          
        case 'text':
          processedConfig = {
            content: processedConfig.content || 'Default text',
            fontSize: processedConfig.fontSize || 14,
            ...processedConfig
          };
          break;
          
        case 'filter':
          processedConfig = {
            filterType: processedConfig.filterType || 'dropdown',
            options: processedConfig.options || [],
            defaultValue: processedConfig.defaultValue,
            ...processedConfig
          };
          break;
      }
      
      return {
        id: widgetId,
        type: widgetType,
        position: this.validatePosition(widget.position || { x: index * 3, y: index * 2, width: 3, height: 4 }),
        config: processedConfig,
        title: widget.title || `${widgetType.charAt(0).toUpperCase() + widgetType.slice(1)} Widget`,
        visible: widget.visible !== false, // Default to true if not specified
        refreshEnabled: widget.refreshEnabled !== false
      };
    });
  }

  private validatePosition(position: any): any {
    // Ensure position has valid values
    return {
      x: Math.max(0, position.x || 0),
      y: Math.max(0, position.y || 0),
      width: Math.max(1, Math.min(12, position.width || 3)), // Max width of 12 (bootstrap-like grid)
      height: Math.max(1, position.height || 4)
    };
  }

  private generateLayout(widgets: any[]): any {
    // Calculate layout metrics
    let maxX = 0;
    let maxY = 0;
    let totalArea = 0;
    
    for (const widget of widgets) {
      const rightEdge = widget.position.x + widget.position.width;
      const bottomEdge = widget.position.y + widget.position.height;
      
      maxX = Math.max(maxX, rightEdge);
      maxY = Math.max(maxY, bottomEdge);
      totalArea += widget.position.width * widget.position.height;
    }
    
    return {
      gridColumns: 12,
      totalRows: Math.ceil(maxY),
      totalWidth: maxX,
      totalHeight: maxY,
      totalArea,
      aspectRatio: maxX > 0 ? parseFloat((maxY / maxX).toFixed(2)) : 1,
      widgetDistribution: this.analyzeWidgetDistribution(widgets)
    };
  }

  private analyzeWidgetDistribution(widgets: any[]): any {
    const distribution: any = {};
    
    for (const widget of widgets) {
      distribution[widget.type] = (distribution[widget.type] || 0) + 1;
    }
    
    return distribution;
  }

  private generateId(): string {
    // Generate a unique ID for the dashboard
    return `dashboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}