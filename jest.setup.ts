//
//
//

// Mock WatermelonDB SQLiteAdapter
jest.mock("@nozbe/watermelondb/adapters/sqlite", () => {
  return jest.fn(() => ({
    schema: jest.fn(),
    migrations: jest.fn(),
  }));
});

jest.mock("@nozbe/watermelondb", () => {
  const actualWatermelonDB = jest.requireActual("@nozbe/watermelondb");
  return {
    ...actualWatermelonDB,
    Database: jest.fn(() => ({
      get: jest.fn(() => ({
        query: jest.fn().mockReturnThis(),
        fetch: jest.fn(() => Promise.resolve([])),
        create: jest.fn(() => Promise.resolve({})), // Mock create method
      })),
      write: jest.fn((action) => action()), // Mock write method to execute the action callback
    })),
  };
});

// Mock UUID generation
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-uuid"),
}));

// Mock react-native-get-random-values
jest.mock("react-native-get-random-values", () => ({
  getRandomValues: jest.fn(),
}));

// Suppress console warnings during tests
const realError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (message.startsWith && message.startsWith("Warning:")) {
    return;
  }
  realError(...args);
};

// Use fake timers
jest.useFakeTimers();
