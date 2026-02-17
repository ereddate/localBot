/**
 * 运营管理流程模型
 * 包含供应链管理、生产计划、质量管理、库存控制等流程
 */

import { WorkflowDefinition } from '../tasks/WorkflowEngine';
import { Tool } from '../types';

export interface OperationsProcessData {
  productId: string;
  orderId: string;
  supplierId: string;
  qualityControlId: string;
  inventoryLevel: number;
}

// 供应链管理流程
export const supplyChainManagementProcess: WorkflowDefinition = {
  id: 'supply-chain-management-process',
  name: '供应链管理流程',
  description: '从供应商管理到交付的完整供应链流程',
  steps: [
    {
      id: 'supplier-discovery',
      tool: 'database_query',
      params: {
        query: 'SELECT * FROM suppliers WHERE category = "{{product_category}}" AND rating >= 4.0'
      },
      description: '供应商发现'
    },
    {
      id: 'supplier-evaluation',
      tool: 'evaluation_system',
      params: {
        evaluationCriteria: ['quality', 'delivery_time', 'cost', 'reliability', 'financial_stability'],
        suppliers: '{{supplier-discovery.result.potential_suppliers}}',
        weights: [0.3, 0.25, 0.2, 0.15, 0.1]
      },
      description: '供应商评估',
      dependsOn: ['supplier-discovery']
    },
    {
      id: 'supplier-onboarding',
      tool: 'document_generator',
      params: {
        template: 'supplier_onboarding_package',
        data: {
          supplierInfo: '{{supplier-evaluation.result.selected_supplier}}',
          contracts: ['nda', 'service_level_agreement', 'payment_terms'],
          complianceRequirements: true
        }
      },
      description: '供应商入驻',
      dependsOn: ['supplier-evaluation']
    },
    {
      id: 'purchase-order-creation',
      tool: 'erp_operations',
      params: {
        operation: 'create_po',
        supplierId: '{{supplier-onboarding.result.supplier_id}}',
        items: '{{requirements_specification.result.required_items}}',
        deliverySchedule: '{{production_schedule.result.delivery_timeline}}'
      },
      description: '采购订单创建',
      dependsOn: ['supplier-onboarding']
    },
    {
      id: 'order-tracking',
      tool: 'tracking_system',
      params: {
        poId: '{{purchase-order-creation.result.po_id}}',
        trackingFrequency: 'daily',
        alerts: ['delay', 'quality_issue', 'quantity_discrepancy']
      },
      description: '订单跟踪',
      dependsOn: ['purchase-order-creation']
    },
    {
      id: 'goods-receipt',
      tool: 'inventory_management',
      params: {
        operation: 'receive_goods',
        poId: '{{order-tracking.result.po_id}}',
        receivedItems: '{{order-tracking.result.delivered_items}}',
        qualityCheckRequired: true
      },
      description: '货物接收',
      dependsOn: ['order-tracking']
    },
    {
      id: 'payment-processing',
      tool: 'accounts_payable',
      params: {
        operation: 'process_invoice',
        poId: '{{goods-receipt.result.po_id}}',
        invoiceAmount: '{{goods-receipt.result.received_items.value}}',
        paymentTerms: '{{supplier-onboarding.result.payment_terms}}'
      },
      description: '付款处理',
      dependsOn: ['goods-receipt']
    },
    {
      id: 'performance-monitoring',
      tool: 'dashboard_generator',
      params: {
        kpi: ['on_time_delivery_rate', 'quality_score', 'cost_performance', 'response_time'],
        supplierId: '{{supplier-onboarding.result.supplier_id}}',
        reportingPeriod: 'monthly'
      },
      description: '绩效监控',
      dependsOn: ['payment-processing']
    }
  ]
};

// 生产计划流程
export const productionPlanningProcess: WorkflowDefinition = {
  id: 'production-planning-process',
  name: '生产计划流程',
  description: '从需求预测到生产执行的完整流程',
  steps: [
    {
      id: 'demand-forecasting',
      tool: 'analytics_engine',
      params: {
        analysisType: 'demand_forecasting',
        historicalData: 'sales_history_24_months',
        seasonalityFactors: true,
        marketTrends: true
      },
      description: '需求预测'
    },
    {
      id: 'capacity-planning',
      tool: 'resource_planner',
      params: {
        availableResources: ['machines', 'personnel', 'materials', 'facilities'],
        capacityRequirements: '{{demand-forecasting.result.forecasted_demand}}',
        utilizationTargets: 0.85
      },
      description: '产能规划',
      dependsOn: ['demand-forecasting']
    },
    {
      id: 'material-requirement-planning',
      tool: 'mrp_system',
      params: {
        billOfMaterials: '{{product_specification.result.bom}}',
        forecastedDemand: '{{demand-forecasting.result.forecast}}',
        currentInventory: '{{inventory_check.result.current_levels}}',
        safetyStock: '{{inventory_policy.result.safety_stock_levels}}'
      },
      description: '物料需求计划',
      dependsOn: ['demand-forecasting', 'capacity-planning']
    },
    {
      id: 'production-scheduling',
      tool: 'scheduler',
      params: {
        tasks: '{{material-requirement-planning.result.production_tasks}}',
        resources: '{{capacity-planning.result.available_resources}}',
        priorities: ['urgent_orders', 'scheduled_maintenance', 'resource_availability'],
        optimizationGoal: 'minimize_makespan'
      },
      description: '生产排程',
      dependsOn: ['material-requirement-planning', 'capacity-planning']
    },
    {
      id: 'work-order-generation',
      tool: 'manufacturing_system',
      params: {
        operation: 'create_work_orders',
        schedule: '{{production-scheduling.result.optimized_schedule}}',
        routing: '{{product_specification.result.manufacturing_routing}}',
        qualityCheckpoints: true
      },
      description: '工单生成',
      dependsOn: ['production-scheduling']
    },
    {
      id: 'production-monitoring',
      tool: 'iot_integration',
      params: {
        monitoringPoints: ['machine_efficiency', 'quality_metrics', 'production_rate', 'downtime'],
        frequency: 'real_time',
        alerts: ['deviation_from_plan', 'quality_threshold_breach', 'equipment_failure']
      },
      description: '生产监控',
      dependsOn: ['work-order-generation']
    },
    {
      id: 'quality-assurance',
      tool: 'quality_system',
      params: {
        inspectionPoints: '{{work-order-generation.result.quality_checkpoints}}',
        samplingPlan: 'statistical_sampling',
        acceptanceCriteria: '{{product_specification.result.quality_standards}}'
      },
      description: '质量保证',
      dependsOn: ['work-order-generation']
    },
    {
      id: 'production-reporting',
      tool: 'report_generator',
      params: {
        reportType: 'production_performance',
        metrics: ['overall_equipment_effectiveness', 'first_pass_yield', 'cycle_time', 'throughput'],
        recipients: ['production_manager', 'quality_manager', 'operations_director']
      },
      description: '生产报告',
      dependsOn: ['production-monitoring', 'quality-assurance']
    }
  ]
};

// 质量管理流程
export const qualityManagementProcess: WorkflowDefinition = {
  id: 'quality-management-process',
  name: '质量管理流程',
  description: '从质量标准制定到持续改进的完整流程',
  steps: [
    {
      id: 'quality-standard-definition',
      tool: 'standard_registry',
      params: {
        standardType: 'product_quality',
        applicableProducts: '{{product_catalog.result.product_lines}}',
        complianceRequirements: ['iso_9001', 'industry_specific', 'customer_specific']
      },
      description: '质量标准制定'
    },
    {
      id: 'inspection-plan-creation',
      tool: 'quality_planner',
      params: {
        inspectionType: 'incoming_materials',
        frequency: 'continuous',
        sampleSize: 'statistical',
        acceptanceCriteria: '{{quality-standard-definition.result.standards}}'
      },
      description: '检验计划制定',
      dependsOn: ['quality-standard-definition']
    },
    {
      id: 'incoming-materials-inspection',
      tool: 'quality_system',
      params: {
        operation: 'inspect_materials',
        materials: '{{goods_receipt.result.materials_received}}',
        inspectionPlan: '{{inspection-plan-creation.result.plan}}',
        testProcedures: '{{quality-standard-definition.result.test_methods}}'
      },
      description: '来料检验',
      dependsOn: ['inspection-plan-creation']
    },
    {
      id: 'in-process-quality-control',
      tool: 'quality_monitoring',
      params: {
        checkpoints: '{{production_schedule.result.control_points}}',
        parameters: '{{quality-standard-definition.result.control_parameters}}',
        samplingFrequency: '{{inspection-plan-creation.result.frequency}}'
      },
      description: '制程质量控制',
      dependsOn: ['incoming-materials-inspection']
    },
    {
      id: 'final-product-inspection',
      tool: 'quality_system',
      params: {
        operation: 'inspect_final_product',
        products: '{{production_completion.result.finished_goods}}',
        acceptanceCriteria: '{{quality-standard-definition.result.finals_specs}}',
        certificationRequired: true
      },
      description: '成品检验',
      dependsOn: ['in-process-quality-control']
    },
    {
      id: 'non-conformance-management',
      tool: 'issue_tracker',
      params: {
        operation: 'create_ncr',
        nonConformances: '{{final-product-inspection.result.failed_items}}',
        severityLevel: '{{quality_assessment.result.severity}}',
        containmentActions: true
      },
      description: '不合格品管理',
      dependsOn: ['final-product-inspection']
    },
    {
      id: 'corrective-action-process',
      tool: 'workflow_system',
      params: {
        operation: 'initiate_capa',
        ncrId: '{{non-conformance-management.result.ncr_id}}',
        rootCauseAnalysis: true,
        correctiveActions: '{{problem_resolution.result.actions}}',
        preventiveMeasures: true
      },
      description: '纠正预防措施',
      dependsOn: ['non-conformance-management']
    },
    {
      id: 'quality-reporting',
      tool: 'report_generator',
      params: {
        reportType: 'quality_performance',
        metrics: ['defect_rate', 'first_pass_yield', 'customer_complaints', 'audit_results'],
        trendAnalysis: true,
        improvementRecommendations: true
      },
      description: '质量报告',
      dependsOn: ['corrective-action-process']
    }
  ]
};

// 库存控制流程
export const inventoryControlProcess: WorkflowDefinition = {
  id: 'inventory-control-process',
  name: '库存控制流程',
  description: '从库存监控到补货的完整流程',
  steps: [
    {
      id: 'inventory-level-monitoring',
      tool: 'inventory_management',
      params: {
        operation: 'monitor_levels',
        items: 'all_inventory_items',
        checkFrequency: 'real_time',
        thresholds: ['min_level', 'reorder_point', 'max_level']
      },
      description: '库存水平监控'
    },
    {
      id: 'demand-analysis',
      tool: 'analytics_engine',
      params: {
        analysisType: 'consumption_pattern',
        historicalData: 'usage_history_12_months',
        seasonalFactors: true,
        trendAnalysis: true
      },
      description: '需求分析',
      dependsOn: ['inventory-level-monitoring']
    },
    {
      id: 'reorder-point-calculation',
      tool: 'inventory_optimizer',
      params: {
        calculationMethod: 'economic_order_quantity',
        demandData: '{{demand-analysis.result.demand_patterns}}',
        leadTimes: '{{supplier_performance.result.lead_times}}',
        holdingCosts: true,
        orderingCosts: true
      },
      description: '补货点计算',
      dependsOn: ['demand-analysis']
    },
    {
      id: 'stock-replenishment-trigger',
      tool: 'replenishment_system',
      params: {
        triggerCondition: 'inventory_level <= reorder_point',
        items: '{{inventory-level-monitoring.result.items_below_reorder}}',
        suggestedOrderQuantities: '{{reorder-point-calculation.result.quantities}}'
      },
      description: '补货触发',
      dependsOn: ['reorder-point-calculation']
    },
    {
      id: 'purchase-order-generation',
      tool: 'procurement_system',
      params: {
        operation: 'create_purchase_orders',
        suppliers: '{{supplier_database.result.preferred_suppliers}}',
        items: '{{stock-replenishment-trigger.result.replenishment_items}}',
        quantities: '{{stock-replenishment-trigger.result.suggested_quantities}}'
      },
      description: '采购订单生成',
      dependsOn: ['stock-replenishment-trigger']
    },
    {
      id: 'inventory-receiving',
      tool: 'warehouse_management',
      params: {
        operation: 'receive_stock',
        poIds: '{{purchase-order-generation.result.po_numbers}}',
        expectedItems: '{{purchase-order-generation.result.ordered_items}}',
        qualityCheckRequired: true
      },
      description: '库存接收',
      dependsOn: ['purchase-order-generation']
    },
    {
      id: 'stock-placement',
      tool: 'warehouse_optimizer',
      params: {
        operation: 'optimize_placement',
        items: '{{inventory-receiving.result.received_items}}',
        warehouseLayout: 'current_layout',
        pickingEfficiency: true,
        rotationRequirements: 'fifo'
      },
      description: '库存上架',
      dependsOn: ['inventory-receiving']
    },
    {
      id: 'inventory-accuracy-audit',
      tool: 'audit_system',
      params: {
        auditType: 'cycle_count',
        items: '{{inventory-level-monitoring.result.high_value_items}}',
        frequency: 'weekly',
        accuracyThreshold: 0.995
      },
      description: '库存准确性审计',
      dependsOn: ['stock-placement']
    },
    {
      id: 'inventory-reporting',
      tool: 'report_generator',
      params: {
        reportType: 'inventory_performance',
        metrics: ['turnover_rate', 'carrying_costs', 'obsolescence_rate', 'accuracy_rate'],
        abcAnalysis: true,
        recommendations: '{{inventory_optimizer.result.optimization_suggestions}}'
      },
      description: '库存报告',
      dependsOn: ['inventory-accuracy-audit']
    }
  ]
};