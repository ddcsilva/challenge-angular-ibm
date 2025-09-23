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
  moduleNameMapping: {
    '^@app/(.*)$': '<rootDir>/projects/angular-challenge/src/app/$1',
    '^@features/(.*)$': '<rootDir>/projects/angular-challenge/src/app/features/$1',
    '^@ui/(.*)$': '<rootDir>/projects/angular-challenge/src/app/ui/$1',
    '^@core/(.*)$': '<rootDir>/projects/angular-challenge/src/app/core/$1',
  },
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
