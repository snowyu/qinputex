module.exports = {
  globals: {
    __DEV__: true,
    "vue-jest": {
      // "babelConfig": ".babelrc",
      "tsConfig": __dirname + "/tsconfig.jest.json"
    },
    "ts-jest": {
      // "useBabelrc": true,
      "diagnostics": true,
      // "skipBabel": true,
      "tsConfig": "tsconfig.jest.json"
    }
  },
  // 'testEnvironment': 'jsdom-with-canvas',
  setupFilesAfterEnv: [
    // 'jest-extended',
    '<rootDir>/jest.setup.js'
  ],
  noStackTrace: true,
  bail: true,
  cache: false,
  verbose: true,
  collectCoverage: false,
  // coverageDirectory: '<rootDir>/test/jest/coverage',
  collectCoverageFrom: [
    '!<rootDir>/src/(assets|environment|types|router|boot|i18n)/**',
    '<rootDir>/src/**/*.vue',
    '<rootDir>/src/**/*.js',
    '<rootDir>/src/**/*.ts',
    '<rootDir>/src/**/*.jsx'
  ],
  coverageThreshold: {
    global: {
    //  branches: 50,
    //  functions: 50,
    //  lines: 50,
    //  statements: 50
    }
  },
  // "testRegex": "src/.*(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testMatch: [
    // '<rootDir>/test/jest/__tests__/**/*.spec.js',
    // '<rootDir>/test/jest/__tests__/**/*.test.js',
    '<rootDir>/src/**/__tests__/*_jest.spec.(t|j)s',
    '<rootDir>/src/**/*.(spec|test).(t|j)s',
    // '<rootDir>/src/**/__tests__/*_jest.spec.ts',
    '<rootDir>/test/jest/__tests__/**/*.(spec|test).(t|j)s',
    // '<rootDir>/test/jest/__tests__/**/*.test.js',
  ],
  moduleFileExtensions: [
    'vue',
    'js',
    'jsx',
    'json',
    'ts',
    'tsx'
  ],
  moduleNameMapper: {
    "^@env/?(.*)$": "<rootDir>/src/environment/$1",
    "^@libs/(.*)$":  "<rootDir>/src/libs/$1",
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.common.js',
    '^test-utils$': '<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.js',
    '^quasar$': '<rootDir>/node_modules/quasar/dist/quasar.umd.js',
    '^~/(.*)$': '<rootDir>/$1',
    // '^src/(.*)$': '<rootDir>/src/$1',
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/test/jest/utils/fileMock.js",
   "\\.(css|less|sass|stylus)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    '.*\\.vue$': '<rootDir>/node_modules/vue-jest',
    '.*\\.jsx?$': '<rootDir>/node_modules/babel-jest',
    // "\\.(gql|graphql)$": "jest-transform-graphql",
  },
  transformIgnorePatterns: [
    // '/node_modules/(?!@ionic-native).+\\.js$',
    "<rootDir>/node_modules/(?!@ngrx|@ionic-native|@ionic)", //only transform ionic packages.
  ],
  snapshotSerializers: [
    '<rootDir>/node_modules/jest-serializer-vue'
  ]
}
