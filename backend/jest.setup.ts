// backend/jest.setup.ts
import dotenv from "dotenv";
dotenv.config();

// Global timeout
jest.setTimeout(10000);

// Mock console methods during tests
global.console = {
	...console,
	log: jest.fn(),
	error: jest.fn(),
	warn: jest.fn(),
};
