//
//
//
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { FETCH_myVocabs } from "./FETCH_myVocabs";
import {
  FETCH_myVocabs_ERRORS,
  FETCH_myVocabs_ARG_TYPES,
  FETCH_myVocabs_RESPONSE_TYPE,
} from "./types";
import { Vocabs_DB } from "@/src/db";

// Import mocks
import {
  VALIDATE_args,
  VALIDATE_watermelonFetch,
  GET_fetchMyVocabConditions,
} from "./helpers";
import { HANDLE_userErrorInsideFinalCatchBlock } from "@/src/utils";

// Mock dependencies
jest.mock("@/src/db", () => ({
  Vocabs_DB: {
    query: jest.fn(),
  },
}));

jest.mock("./helpers", () => ({
  VALIDATE_args: jest.fn(),
  VALIDATE_watermelonFetch: jest.fn(),
  GET_fetchMyVocabConditions: jest.fn(),
}));
jest.mock("@/src/utils", () => ({
  HANDLE_userErrorInsideFinalCatchBlock: jest.fn(),
}));

describe("FETCH_myVocabs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (VALIDATE_args as jest.Mock).mockImplementation(() => {});
  });

  const CREATE_queryMock = (mockVocabs: any, mockTotalCount: any) => {
    const query = {
      extend: jest.fn(() => query), // make extend return the query object itself
      fetchCount: jest.fn(() => Promise.resolve(mockTotalCount)),
      fetch: jest.fn(() => Promise.resolve(mockVocabs)),
    } as { extend: jest.Mock; fetchCount: jest.Mock; fetch: jest.Mock };
    return query;
  };

  const mockConditions = {
    filter_CONDITIONS: [],
    sorting_CONDITIONS: [],
    pagination_CONDITIONS: [],
  };

  const mockArgs = {
    type: "allVocabs",
    start: 0,
    search: "",
    user_id: "user123",
    z_vocabDisplay_SETTINGS: { sorting: "date" },
  } as FETCH_myVocabs_ARG_TYPES;

  const MOCK_errorResponse = (errorMessage: string) => ({
    error_TYPE: "internal",
    internal_MSG: errorMessage,
    user_MSG: "An error occurred. Please try again later.",
    function_NAME: "FETCH_myVocabs",
  });

  //////////////////////////////////////////////////////////////////////

  test("1. Returns data when all inputs are valid", async () => {
    const mockVocabs = [{ id: "vocab1", word: "apple", definition: "A fruit" }];
    const mockTotalCount = 1;

    const query = CREATE_queryMock(mockVocabs, mockTotalCount);
    (Vocabs_DB.query as jest.Mock).mockReturnValue(query);
    (GET_fetchMyVocabConditions as jest.Mock).mockReturnValue(mockConditions);

    const result = await FETCH_myVocabs(mockArgs);

    expect(result).toEqual({
      data: {
        vocabs: mockVocabs,
        totalCount: mockTotalCount,
      },
    });
    expect(VALIDATE_args).toHaveBeenCalledWith({
      args: mockArgs,
      THROW_err: expect.any(Function),
    });
    expect(VALIDATE_watermelonFetch).toHaveBeenCalledWith({
      totalCount: mockTotalCount,
      vocabs: mockVocabs,
      THROW_err: expect.any(Function),
    });
  });

  test("2. Returns empty results when no records are found", async () => {
    const mockVocabs: any[] = [];
    const mockTotalCount = 0;

    const query = CREATE_queryMock(mockVocabs, mockTotalCount);
    (Vocabs_DB.query as jest.Mock).mockReturnValue(query);
    (GET_fetchMyVocabConditions as jest.Mock).mockReturnValue(mockConditions);

    const result = await FETCH_myVocabs(mockArgs);

    expect(result).toEqual({
      data: {
        vocabs: mockVocabs,
        totalCount: mockTotalCount,
      },
    });
  });

  test("3. Returns valid response with empty vocabs", async () => {
    const mockVocabs: any[] = [];
    const mockTotalCount = 5;

    const query = CREATE_queryMock(mockVocabs, mockTotalCount);
    (Vocabs_DB.query as jest.Mock).mockReturnValue(query);
    (GET_fetchMyVocabConditions as jest.Mock).mockReturnValue(mockConditions);

    const result = await FETCH_myVocabs(mockArgs);

    expect(result).toEqual({
      data: {
        vocabs: mockVocabs,
        totalCount: mockTotalCount,
      },
    });
  });
  test("4. Throws error when args are invalid", async () => {
    const mockVocabs = [{ id: "vocab1", word: "apple", definition: "A fruit" }];
    const mockTotalCount = 1;
    const errorMessage = "Invalid args";

    const query = CREATE_queryMock(mockVocabs, mockTotalCount);
    (Vocabs_DB.query as jest.Mock).mockReturnValue(query);

    (GET_fetchMyVocabConditions as jest.Mock).mockReturnValue(mockConditions);

    (VALIDATE_args as jest.Mock).mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    const mockErrorResponse = MOCK_errorResponse(errorMessage);
    (HANDLE_userErrorInsideFinalCatchBlock as jest.Mock).mockReturnValue(
      mockErrorResponse
    );

    const result = await FETCH_myVocabs(mockArgs);

    expect(result).toEqual({
      error: mockErrorResponse,
    });
  });
});
