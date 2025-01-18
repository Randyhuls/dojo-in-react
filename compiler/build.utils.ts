import { readFileSync, writeFileSync } from 'fs';

// Types
import { BasePackageJSON } from './build.types';

export const createPackageJSON = (props: BasePackageJSON): void => {
  const { inputPath, outputPath, ...packageJSONProps } = props;

  try {
    const inputJSON = inputPath ? JSON.parse(readFileSync(inputPath, 'utf-8').toString()) : {};

    const outputJSON: Record<string, unknown> = {
      ...inputJSON,
      ...packageJSONProps
    } satisfies BasePackageJSON

    writeFileSync(outputPath, JSON.stringify(outputJSON, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write package.json file:', err)
  }
};