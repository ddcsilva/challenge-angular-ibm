module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['<rootDir>/projects/**/*.spec.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  collectCoverageFrom: [
    'projects/**/src/**/*.{ts,tsx}',
    '!projects/**/src/**/*.d.ts',
    '!projects/**/src/main.ts',
    '!projects/**/src/polyfills.ts',
    '!projects/**/src/test.ts',
    '!projects/**/src/environments/**',
  ],
  transformIgnorePatterns: ['node_modules/(?!@angular|@ngrx|ngx-socket-io)'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/projects/angular-challenge/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
};
