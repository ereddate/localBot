import { Tool, ToolResult } from '../types';

export class VisualizationTool implements Tool {
  name = 'data_visualization_tool';
  category = 'other' as const;
  description = 'Creates visual representations of data including charts, graphs, and dashboards.';
  parameters = {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: {
          type: 'object'
        },
        description: 'Data to visualize'
      },
      chartType: {
        type: 'string',
        enum: ['bar', 'line', 'pie', 'scatter', 'heatmap', 'histogram', 'area', 'radar', 'treemap'],
        description: 'Type of chart to create'
      },
      xField: {
        type: 'string',
        description: 'Field to use for x-axis'
      },
      yField: {
        type: 'string',
        description: 'Field to use for y-axis'
      },
      title: {
        type: 'string',
        description: 'Title for the visualization'
      },
      options: {
        type: 'object',
        description: 'Additional visualization options'
      }
    },
    required: ['data', 'chartType']
  };

  async execute(params: any): Promise<any> {
    try {
      const { data, chartType, xField, yField, title, options = {} } = params;
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Data must be a non-empty array');
      }
      
      return this.createVisualization(data, chartType, xField, yField, title, options);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: `Failed to create visualization: ${errorMessage}` };
    }
  }

  private async createVisualization(
    data: any[],
    chartType: string,
    xField?: string,
    yField?: string,
    title?: string,
    options: any = {}
  ): Promise<any> {
    const startTime = new Date();
    
    // Prepare visualization based on chart type
    const vizSpec = this.generateVisualizationSpec(data, chartType, xField, yField, title, options);
    
    // Simulate creating the visualization
    const result = {
      visualization: {
        type: chartType,
        title: title || `Data Visualization (${chartType})`,
        specification: vizSpec,
        dataSummary: {
          records: data.length,
          fields: Object.keys(data[0] || {}),
          missingValues: this.countMissingValues(data)
        },
        chartConfig: {
          width: options.width || 800,
          height: options.height || 600,
          colorScheme: options.colorScheme || 'default',
          theme: options.theme || 'light'
        },
        generatedAt: new Date().toISOString(),
        status: 'completed'
      }
    };
    
    const endTime = new Date();
    
    return {
      ...result,
      executionTimeMs: endTime.getTime() - startTime.getTime()
    };
  }

  private generateVisualizationSpec(
    data: any[],
    chartType: string,
    xField?: string,
    yField?: string,
    title?: string,
    options: any = {}
  ): any {
    const spec: any = {
      chartType,
      title: title || `Data Visualization (${chartType})`,
      data: {
        values: data
      },
      encoding: {}
    };
    
    // Set encoding based on chart type and provided fields
    switch(chartType) {
      case 'bar':
        spec.encoding.x = { field: xField || this.getDimensionField(data), type: 'nominal' };
        spec.encoding.y = { field: yField || this.getMeasureField(data), type: 'quantitative' };
        spec.mark = 'bar';
        break;
        
      case 'line':
        spec.encoding.x = { field: xField || this.getTemporalField(data) || this.getMeasureField(data), type: 'temporal' };
        spec.encoding.y = { field: yField || this.getMeasureField(data), type: 'quantitative' };
        spec.mark = 'line';
        break;
        
      case 'pie':
        spec.encoding.theta = { field: yField || this.getMeasureField(data), type: 'quantitative' };
        spec.encoding.color = { field: xField || this.getDimensionField(data), type: 'nominal' };
        spec.mark = { type: 'arc', innerRadius: 0 };
        break;
        
      case 'scatter':
        spec.encoding.x = { field: xField || this.getMeasureField(data), type: 'quantitative' };
        spec.encoding.y = { field: yField || this.getMeasureField(data), type: 'quantitative' };
        spec.mark = 'point';
        break;
        
      case 'heatmap':
        spec.encoding.x = { field: xField || this.getDimensionField(data), type: 'nominal' };
        spec.encoding.y = { field: yField || this.getDimensionField(data), type: 'nominal' };
        spec.encoding.color = { field: this.getMeasureField(data), type: 'quantitative' };
        spec.mark = 'rect';
        break;
        
      case 'histogram':
        spec.encoding.x = { bin: true, field: xField || this.getMeasureField(data), type: 'quantitative' };
        spec.encoding.y = { aggregate: 'count', type: 'quantitative' };
        spec.mark = 'bar';
        break;
        
      case 'area':
        spec.encoding.x = { field: xField || this.getTemporalField(data) || this.getMeasureField(data), type: 'temporal' };
        spec.encoding.y = { field: yField || this.getMeasureField(data), type: 'quantitative' };
        spec.mark = 'area';
        break;
        
      case 'radar':
        // Radar chart typically needs categorical axis and quantitative values
        spec.encoding.angle = { field: xField || this.getDimensionField(data), type: 'nominal' };
        spec.encoding.radius = { field: yField || this.getMeasureField(data), type: 'quantitative' };
        spec.mark = 'line';
        break;
        
      case 'treemap':
        spec.encoding.color = { field: yField || this.getMeasureField(data), type: 'quantitative' };
        spec.encoding.size = { field: yField || this.getMeasureField(data), type: 'quantitative' };
        spec.mark = 'rect';
        break;
        
      default:
        // Default to bar chart
        spec.encoding.x = { field: xField || this.getDimensionField(data), type: 'nominal' };
        spec.encoding.y = { field: yField || this.getMeasureField(data), type: 'quantitative' };
        spec.mark = 'bar';
    }
    
    // Add any additional options
    if (options.color) {
      spec.encoding.color = { ...spec.encoding.color, value: options.color };
    }
    
    if (options.opacity !== undefined) {
      spec.mark = { ...spec.mark, opacity: options.opacity };
    }
    
    return spec;
  }

  private getDimensionField(data: any[]): string {
    // Find a suitable dimension field (string/categorical)
    if (data.length === 0) return '';
    
    const firstRow = data[0];
    for (const [key, value] of Object.entries(firstRow)) {
      if (typeof value === 'string' || typeof value === 'boolean') {
        return key;
      }
    }
    
    // If no string field found, return the first field
    return Object.keys(firstRow)[0] || '';
  }

  private getMeasureField(data: any[]): string {
    // Find a suitable measure field (numeric)
    if (data.length === 0) return '';
    
    const firstRow = data[0];
    for (const [key, value] of Object.entries(firstRow)) {
      if (typeof value === 'number' && !isNaN(value)) {
        return key;
      }
    }
    
    // If no numeric field found, return the first field
    return Object.keys(firstRow)[0] || '';
  }

  private getTemporalField(data: any[]): string | null {
    // Find a suitable temporal field (date/time)
    if (data.length === 0) return null;
    
    const firstRow = data[0];
    for (const [key, value] of Object.entries(firstRow)) {
      if (this.isDateLike(value)) {
        return key;
      }
    }
    
    return null;
  }

  private isDateLike(value: any): boolean {
    // Check if value looks like a date
    if (typeof value === 'string') {
      // Check if it matches common date formats
      const dateRegex = /^\d{4}-\d{2}-\d{2}/;
      const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      return dateRegex.test(value) || dateTimeRegex.test(value);
    }
    
    if (value instanceof Date) {
      return true;
    }
    
    return false;
  }

  private countMissingValues(data: any[]): number {
    // Count missing/null/undefined values in the dataset
    let count = 0;
    for (const row of data) {
      for (const value of Object.values(row)) {
        if (value === null || value === undefined || value === '') {
          count++;
        }
      }
    }
    return count;
  }
}