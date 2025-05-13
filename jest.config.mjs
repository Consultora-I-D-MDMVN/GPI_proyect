// jest.config.mjs
import nextJest from 'next/jest.js' // Use .js extension for ESM import

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: './' })

// Any custom config you want to pass to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Keep as .js if you create this file

  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
}

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js configuration, which is async
export default createJestConfig(customJestConfig)
