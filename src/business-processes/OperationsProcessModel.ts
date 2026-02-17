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
      id: 'demand-forecasting',
      tool: 'analytics_engine',
      params: {
        operation: 'predict_demand',
        historicalData: true,
        seasonalTrends: true,
        marketConditions: true,
        predictionHorizon: '12_months',
        confidenceInterval: 0.95
      },
      description: '需求预测'
    },
    {
      id: 'supplier-discovery',
      tool: 'database_query',
      params: {
        query: 'SELECT * FROM suppliers WHERE category = "{{product_category}}" AND rating >= 4.0',
        sustainabilityMetrics: true,
        ethicalStandards: true,
        geographicPreferences: '{{demand-forecasting.result.regional_distribution}}'
      },
      description: '供应商发现'
    },
    {
      id: 'risk-assessment',
      tool: 'analytics_engine',
      params: {
        operation: 'supply_chain_risk_analysis',
        suppliers: '{{supplier-discovery.result.potential_suppliers}}',
        riskFactors: [
          'geopolitical_stability',
          'financial_health',
          'natural_disaster_prone_areas',
          'cyber_security_posture',
          'regulatory_compliance'
        ],
        mitigationStrategies: true
      },
      description: '风险评估',
      dependsOn: ['supplier-discovery']
    },
    {
      id: 'supplier-evaluation',
      tool: 'evaluation_system',
      params: {
        evaluationCriteria: [
          'quality', 
          'delivery_time', 
          'cost', 
          'reliability', 
          'financial_stability',
          'sustainability_score',
          'innovation_capability',
          'supply_chain_resilience'
        ],
        suppliers: '{{supplier-discovery.result.potential_suppliers}}',
        weights: [0.2, 0.15, 0.15, 0.15, 0.1, 0.1, 0.1, 0.05],
        evaluationMethod: 'multi_attribute_utility_theory'
      },
      description: '供应商评估',
      dependsOn: ['risk-assessment']
    },
    {
      id: 'supplier-diversification-analysis',
      tool: 'analytics_engine',
      params: {
        operation: 'portfolio_optimization',
        selectedSuppliers: '{{supplier-evaluation.result.top_suppliers}}',
        diversificationGoals: {
          geographicSpread: 0.7,  // 至少70%来自不同地区
          supplierConcentration: 0.3,  // 单一供应商不超过30%
          capacityBuffer: 0.2  // 保留20%备用容量
        }
      },
      description: '供应商多元化分析',
      dependsOn: ['supplier-evaluation']
    },
    {
      id: 'contract-negotiation',
      tool: 'contract_management',
      params: {
        terms: {
          pricing: '{{supplier-evaluation.result.best_supplier.prices}}',
          delivery: '{{supplier-evaluation.result.best_supplier.delivery_schedule}}',
          quality_standards: '{{supplier-evaluation.result.best_supplier.quality_certifications}}'
        },
        clauses: [
          'force_majeure', 
          'liability', 
          'termination',
          'sustainability_commitments',
          'data_security_requirements',
          'performance_incentives'
        ],
        sustainabilityRequirements: '{{supplier-evaluation.result.sustainability_criteria}}'
      },
      description: '合同谈判',
      dependsOn: ['supplier-diversification-analysis']
    },
    {
      id: 'blockchain-contract-setup',
      tool: 'blockchain_operations',
      params: {
        contractType: 'smart_contract',
        parties: ['company', 'primary_supplier', 'backup_supplier'],
        terms: '{{contract-negotiation.result.final_terms}}',
        triggers: [
          'delivery_confirmation',
          'quality_approval',
          'payment_conditions'
        ],
        escrowMechanism: true
      },
      description: '区块链合约设置',
      dependsOn: ['contract-negotiation']
    },
    {
      id: 'order-placement',
      tool: 'erp_system',
      params: {
        operation: 'create_purchase_order',
        supplierId: '{{contract-negotiation.result.contract.supplier_id}}',
        items: '{{demand-forecasting.result.items}}',
        quantities: '{{demand-forecasting.result.quantities}}',
        deliveryDate: '{{contract-negotiation.result.delivery_schedule}}',
        blockchainRef: '{{blockchain-contract-setup.result.contract_address}}'
      },
      description: '订单下达',
      dependsOn: ['blockchain-contract-setup']
    },
    {
      id: 'real-time-tracking',
      tool: 'iot_sensor_integration',
      params: {
        orderId: '{{order-placement.result.order_id}}',
        sensorsEnabled: true,
        trackingPoints: ['origin', 'transit_points', 'destination'],
        environmentalMonitoring: ['temperature', 'humidity', 'shock'],
        predictiveAnalytics: true
      },
      description: '实时跟踪',
      dependsOn: ['order-placement']
    },
    {
      id: 'shipment-tracking',
      tool: 'logistics_tracking',
      params: {
        orderId: '{{order-placement.result.order_id}}',
        carrier: '{{order-placement.result.carrier}}',
        estimatedDelivery: '{{order-placement.result.delivery_date}}',
        blockchainTracking: '{{blockchain-contract-setup.result.contract_address}}',
        exceptionNotifications: true
      },
      description: '货运跟踪',
      dependsOn: ['real-time-tracking']
    },
    {
      id: 'automated-quality-inspection',
      tool: 'computer_vision_ai',
      params: {
        shipmentId: '{{shipment-tracking.result.shipment_id}}',
        inspectionCriteria: ['quantity_accuracy', 'quality_standards', 'packaging_integrity'],
        samplingMethod: 'statistical_sampling',
        defectDetection: true,
        automatedDecision: true
      },
      description: '自动化质量检验',
      dependsOn: ['shipment-tracking']
    },
    {
      id: 'quality-inspection',
      tool: 'quality_control',
      params: {
        shipmentId: '{{automated-quality-inspection.result.shipment_id}}',
        inspectionCriteria: ['quantity_accuracy', 'quality_standards', 'packaging_integrity'],
        samplingMethod: 'statistical_sampling',
        aiRecommendations: '{{automated-quality-inspection.result.ai_findings}}'
      },
      description: '质量检验',
      dependsOn: ['automated-quality-inspection']
    },
    {
      id: 'inventory-optimization',
      tool: 'analytics_engine',
      params: {
        operation: 'optimize_inventory_levels',
        demandForecast: '{{demand-forecasting.result.predictions}}',
        leadTimes: '{{contract-negotiation.result.delivery_schedule}}',
        safetyStock: true,
        economicOrderQuantity: true,
        carryingCosts: true
      },
      description: '库存优化',
      dependsOn: ['quality-inspection']
    },
    {
      id: 'inventory-receiving',
      tool: 'warehouse_management',
      params: {
        shipmentId: '{{quality-inspection.result.approved_shipment_id}}',
        location: '{{inventory-optimization.result.optimal_location}}',
        quantity: '{{quality-inspection.result.accepted_quantity}}',
        automatedPlacement: true
      },
      description: '入库接收',
      dependsOn: ['inventory-optimization']
    },
    {
      id: 'supplier-performance-monitoring',
      tool: 'analytics_engine',
      params: {
        operation: 'continuous_performance_monitoring',
        supplierId: '{{order-placement.result.supplier_id}}',
        metrics: [
          'on_time_delivery_rate',
          'quality_metrics',
          'cost_performance',
          'sustainability_compliance',
          'innovation_contributions'
        ],
        dashboardUpdateFrequency: 'daily'
      },
      description: '供应商绩效监控',
      dependsOn: ['inventory-receiving']
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