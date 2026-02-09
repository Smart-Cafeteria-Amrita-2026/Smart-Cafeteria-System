// backend/jest.config.js
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>"],
	testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
	transform: {
		"^.+\\.ts$": "ts-jest",
	},
	// CORRECTED: moduleNameMapper (not moduleNameMapping)
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},
	collectCoverageFrom: ["services/**/*.ts", "controllers/**/*.ts", "!**/*.d.ts", "!**/index.ts"],
	coverageDirectory: "coverage",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
	verbose: true,
};
