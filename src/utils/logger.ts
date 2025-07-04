/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';

const logError = (error: any) => {
  const logMessage = `${new Date().toISOString()} - ${error.stack}\n`;
  fs.appendFileSync(path.join(__dirname, '../../logs/error.log'), logMessage);
};

export default logError;
