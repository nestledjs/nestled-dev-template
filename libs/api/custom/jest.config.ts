export default {
  displayName: 'api-custom',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/api/custom',
  coverageReporters: ['html', 'lcov', 'text-summary'],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 70,
      functions: 70,
      lines: 85,
    },
    'libs/api/custom/src/lib/plugins/mcp/tools/*.ts': {
      statements: 100,
      branches: 80,
      functions: 100,
      lines: 100,
    },
  },
}
