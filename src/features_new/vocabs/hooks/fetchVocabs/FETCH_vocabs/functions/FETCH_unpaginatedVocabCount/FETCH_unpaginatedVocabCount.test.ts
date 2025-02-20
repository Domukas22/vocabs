import { FETCH_myVocabs_ARG_TYPES, VocabQuery_TYPE } from "../../types";
import { BUILD_vocabFilterQuery } from "../BUILD_vocabFilterQuery/BUILD_vocabFilterQuery";
import { FETCH_unpaginatedVocabCount } from "./FETCH_unpaginatedVocabCount";

// Mock the dependencies
jest.mock("../BUILD_vocabFilterQuery/BUILD_vocabFilterQuery", () => ({
  BUILD_vocabFilterQuery: jest.fn(),
}));

describe("FETCH_unpaginatedVocabCount", () => {
  let mockArgs: FETCH_myVocabs_ARG_TYPES;
  let mockQuery: VocabQuery_TYPE;

  beforeEach(() => {
    mockArgs = {
      sorting: "date",
      sortDirection: "ascending",
    } as FETCH_myVocabs_ARG_TYPES;

    mockQuery = {
      // Populate with the necessary fields for VocabQuery_TYPE
    } as VocabQuery_TYPE;

    jest.clearAllMocks(); // Reset mocks before each test
  });

  test("1. Returns count when no error occurs", async () => {
    const mockCount = 10;

    // Mock the BUILD_vocabFilterQuery function to return a mock query object
    (BUILD_vocabFilterQuery as jest.Mock).mockReturnValueOnce({
      abortSignal: jest.fn().mockResolvedValueOnce({ count: mockCount }),
    });

    const result = await FETCH_unpaginatedVocabCount(mockQuery, mockArgs);

    expect(result).toEqual({ unpaginated_COUNT: mockCount });
    expect(BUILD_vocabFilterQuery).toHaveBeenCalledWith(mockQuery, mockArgs);
  });

  test("2. Throws error when an error occurs during query execution", async () => {
    const mockError = new Error("Error occurred while fetching count");

    // Mock the BUILD_vocabFilterQuery function to simulate an error
    (BUILD_vocabFilterQuery as jest.Mock).mockReturnValueOnce({
      abortSignal: jest.fn().mockRejectedValueOnce(mockError),
    });

    await expect(
      FETCH_unpaginatedVocabCount(mockQuery, mockArgs)
    ).rejects.toThrow(mockError);
    expect(BUILD_vocabFilterQuery).toHaveBeenCalledWith(mockQuery, mockArgs);
  });

  test("3. Returns 0 count when count is undefined", async () => {
    // Mock the BUILD_vocabFilterQuery function to return a result with no count
    (BUILD_vocabFilterQuery as jest.Mock).mockReturnValueOnce({
      abortSignal: jest.fn().mockResolvedValueOnce({ count: undefined }),
    });

    const result = await FETCH_unpaginatedVocabCount(mockQuery, mockArgs);

    expect(result).toEqual({ unpaginated_COUNT: 0 });
    expect(BUILD_vocabFilterQuery).toHaveBeenCalledWith(mockQuery, mockArgs);
  });

  test("4. Calls abortSignal with the provided signal argument", async () => {
    const mockCount = 5;
    const mockSignal = new AbortController().signal;

    // Mock the BUILD_vocabFilterQuery function
    const mockAbortSignal = jest
      .fn()
      .mockResolvedValueOnce({ count: mockCount });
    (BUILD_vocabFilterQuery as jest.Mock).mockReturnValueOnce({
      abortSignal: mockAbortSignal,
    });

    await FETCH_unpaginatedVocabCount(mockQuery, {
      ...mockArgs,
      signal: mockSignal,
    });

    // Ensure abortSignal was called with the correct signal
    expect(mockAbortSignal).toHaveBeenCalledWith(mockSignal);
  });

  test("5. Throws error if query is undefined", async () => {
    const mockError = new Error(
      "'query' undefined when fetching unpaginated vocab count"
    );

    await expect(
      FETCH_unpaginatedVocabCount(
        undefined as unknown as VocabQuery_TYPE,
        mockArgs
      )
    ).rejects.toThrow(mockError);
  });
});
