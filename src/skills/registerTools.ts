import { SkillManager } from './SkillManager';
import { Skill, ToolPermission } from '../types';
import { 
  FileReadTool, 
  FileWriteTool, 
  FileListTool, 
  FileDeleteTool, 
  FileCopyTool, 
  FileMoveTool, 
  FileStatTool 
} from './tools/FileTools';
import { 
  ShellExecuteTool, 
  ProcessListTool, 
  SystemInfoTool, 
  EnvironmentVariableTool, 
  EnvironmentListTool,
  DirectoryChangeTool,
  DirectoryGetCurrentTool,
  ProcessKillTool
} from './tools/ShellTools';
import { 
  HttpGetTool, 
  HttpPostTool, 
  HttpPutTool, 
  HttpDeleteTool, 
  HttpPatchTool, 
  WebFetchTool,
  JsonParseTool,
  JsonStringifyTool
} from './tools/ApiTools';
import { 
  CsvReadTool, 
  CsvWriteTool, 
  JsonReadTool, 
  JsonWriteTool, 
  TextAnalysisTool, 
  TextSearchTool, 
  TextReplaceTool,
  MathCalculateTool,
  JsonListTool,
  MeanValueTool,
  BarChartTool
} from './tools/DataTools';
import { 
  EncryptTool, 
  DecryptTool, 
  HashTool, 
  CompressTool, 
  DecompressTool, 
  Base64EncodeTool, 
  Base64DecodeTool,
  UuidGenerateTool,
  RandomStringTool
} from './tools/UtilityTools';

export function registerDefaultTools(skillManager: SkillManager): void {
  const fileTools = [
    new FileReadTool(),
    new FileWriteTool(),
    new FileListTool(),
    new FileDeleteTool(),
    new FileCopyTool(),
    new FileMoveTool(),
    new FileStatTool()
  ];

  const shellTools = [
    new ShellExecuteTool(),
    new ProcessListTool(),
    new SystemInfoTool(),
    new EnvironmentVariableTool(),
    new EnvironmentListTool(),
    new DirectoryChangeTool(),
    new DirectoryGetCurrentTool(),
    new ProcessKillTool()
  ];

  const apiTools = [
    new HttpGetTool(),
    new HttpPostTool(),
    new HttpPutTool(),
    new HttpDeleteTool(),
    new HttpPatchTool(),
    new WebFetchTool(),
    new JsonParseTool(),
    new JsonStringifyTool()
  ];

  const dataTools = [
    new CsvReadTool(),
    new CsvWriteTool(),
    new JsonReadTool(),
    new JsonWriteTool(),
    new TextAnalysisTool(),
    new TextSearchTool(),
    new TextReplaceTool(),
    new MathCalculateTool(),
    new JsonListTool(),
    new MeanValueTool(),
    new BarChartTool()
  ];

  const utilityTools = [
    new EncryptTool(),
    new DecryptTool(),
    new HashTool(),
    new CompressTool(),
    new DecompressTool(),
    new Base64EncodeTool(),
    new Base64DecodeTool(),
    new UuidGenerateTool(),
    new RandomStringTool()
  ];

  fileTools.forEach(tool => skillManager.registerTool(tool));
  shellTools.forEach(tool => skillManager.registerTool(tool));
  apiTools.forEach(tool => skillManager.registerTool(tool));
  dataTools.forEach(tool => skillManager.registerTool(tool));
  utilityTools.forEach(tool => skillManager.registerTool(tool));

  const fileSkill: Skill = {
    name: 'file-system',
    description: '文件系统操作工具集合',
    tools: fileTools,
    enabled: true,
    permissions: fileTools.map(tool => ({
      toolName: tool.name,
      allowed: true,
      requireConfirmation: tool.name === 'file_delete' || tool.name === 'file_move'
    }))
  };

  const shellSkill: Skill = {
    name: 'shell-commands',
    description: 'Shell命令和系统工具集合',
    tools: shellTools,
    enabled: true,
    permissions: shellTools.map(tool => ({
      toolName: tool.name,
      allowed: true,
      requireConfirmation: tool.name === 'shell_execute' || tool.name === 'process_kill'
    }))
  };

  const apiSkill: Skill = {
    name: 'api-network',
    description: 'API调用和网络工具集合',
    tools: apiTools,
    enabled: true,
    permissions: apiTools.map(tool => ({
      toolName: tool.name,
      allowed: true,
      requireConfirmation: false
    }))
  };

  const dataSkill: Skill = {
    name: 'data-processing',
    description: '数据处理和分析工具集合',
    tools: dataTools,
    enabled: true,
    permissions: dataTools.map(tool => ({
      toolName: tool.name,
      allowed: true,
      requireConfirmation: false
    }))
  };

  const utilitySkill: Skill = {
    name: 'utilities',
    description: '实用工具集合（加密、压缩、编码等）',
    tools: utilityTools,
    enabled: true,
    permissions: utilityTools.map(tool => ({
      toolName: tool.name,
      allowed: true,
      requireConfirmation: false
    }))
  };

  skillManager.registerSkill(fileSkill);
  skillManager.registerSkill(shellSkill);
  skillManager.registerSkill(apiSkill);
  skillManager.registerSkill(dataSkill);
  skillManager.registerSkill(utilitySkill);
}
