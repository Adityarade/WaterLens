import { execSync } from 'child_process';
import fs from 'fs';

console.log('Building WaterLens Frontend...');
execSync('npm run build --workspace=frontend', { stdio: 'inherit' });

if (fs.existsSync('frontend/dist')) {
  fs.cpSync('frontend/dist', 'dist', { recursive: true });
  console.log('Synchronized build output to dist/ and frontend/dist/');
}
