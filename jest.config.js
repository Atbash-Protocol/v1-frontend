module.exports = {
    // The root of your source code, typically /src
    // `<rootDir>` is a token Jest substitutes
    roots: ["<rootDir>/src"],
  
    // Jest transformations -- this adds support for TypeScript
    // using ts-jest
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
  
    // Runs special logic, such as cleaning up components
    // when using React Testing Library and adds special
    // extended assertions to Jest
    setupFilesAfterEnv: [
      "@testing-library/react/cleanup-after-each",
      "@testing-library/jest-dom/extend-expect"
    ],
  
    // Test spec file resolution pattern
    // Matches parent folder `__tests__` and filename
    // should contain `test` or `spec`.
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  
    // Module file extensions for importing
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverage: true,
    "collectCoverageFrom": [
      "<rootDir>/src/**/*.{js,ts,jsx,tsx}",
      "!<rootDir>/src/**/*.d.{js,ts,jsx,tsx}",
      "!<rootDir>/src/locales/*.{js,ts,jsx,tsx}",
      "!<rootDir>/src/index.{js,ts,jsx,tsx}",
      "!<rootDir>/scripts/*",
      "!<rootDir>/src/config/*",
      "!<rootDir>/src/store/store.ts",
      "!<rootDir>/src/tests/utils.tsx"
  ]

    globals: {
      'REACT_APP_DEFAULT_NEWORK_ID': '1'
    }
  }; 



