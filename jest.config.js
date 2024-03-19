module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
      },
};
