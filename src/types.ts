export interface SolutionStep {
  title: string;
  description: string;
  math: string;
}

export interface SolutionResult {
  finalSolution: string;
  explanation: string;
  steps: SolutionStep[];
}