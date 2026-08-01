export interface AgentNode {
  id: string;
  name: string;
  role: string;
  group: RoleGroup;
  x: number;
  y: number;
  connections: string[];
}

export type RoleGroup =
  | "strategy"
  | "tactics"
  | "control"
  | "execution"
  | "memory"
  | "monitoring"
  | "communication"
  | "learning";

export interface MetricCard {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}
