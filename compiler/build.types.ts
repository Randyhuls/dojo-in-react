export interface BasePackageJSON {
  inputPath?: string;
  outputPath: string;
  name: string;
  version: `${number}.${number}.${number}`;
  private?: boolean;
  type?: 'module' | 'commonjs';
  main?: string;
  module?: string;
  exports: Record<string, unknown>;
  types?: string | string[];
  peerDependencies?: Record<string, string>;
  repository?: Record<string, string>;
  author?: string;
  license?: string;
  keywords?: string[];
}