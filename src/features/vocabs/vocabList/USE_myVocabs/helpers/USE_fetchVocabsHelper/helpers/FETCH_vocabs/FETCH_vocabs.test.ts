import { supabase } from "@/src/lib/supabase";
import {
  FETCH_myVocabs_ARG_TYPES,
  FETCH_myVocabs_RESPONSE_TYPE,
} from "./types";
import {
  FETCH_unpaginatedVocabCount,
  FETCH_finalVocabs,
  VALIDATE_args,
} from "./helpers";
import { TRANSFORM_error } from "@/src/utils/TRANSFORM_error/TRANSFORM_error";
import { FETCH_vocabs } from "./FETCH_vocabs";

jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
  },
}));

jest.mock("./helpers", () => ({
  FETCH_unpaginatedVocabCount: jest.fn(),
  FETCH_finalVocabs: jest.fn(),
  VALIDATE_args: jest.fn(),
}));

jest.mock("@/src/utils/TRANSFORM_error/TRANSFORM_error", () => ({
  TRANSFORM_error: jest.fn(),
}));

describe("FETCH_vocabs", () => {
  let mockArgs: FETCH_myVocabs_ARG_TYPES;

  beforeEach(() => {
    mockArgs = {
      sorting: "date",
      sortDirection: "ascending",
    } as FETCH_myVocabs_ARG_TYPES;

    jest.clearAllMocks(); // Reset mocks before each test
  });

  test("1. Fetches vocabs successfully with valid args", async () => {
    const mockVocabs = [{ id: 1, name: "Vocab1" }];
    const mockUnpaginatedCount = 10;

    // Mock the helpers
    (FETCH_unpaginatedVocabCount as jest.Mock).mockResolvedValue({
      unpaginated_COUNT: mockUnpaginatedCount,
    });
    (FETCH_finalVocabs as jest.Mock).mockResolvedValue({
      vocabs: mockVocabs,
    });

    // Mock the Supabase query
    (supabase.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn().mockResolvedValueOnce({ data: mockVocabs }),
    });

    const result = await FETCH_vocabs(mockArgs);

    expect(result.data).toEqual({
      vocabs: mockVocabs,
      unpaginated_COUNT: mockUnpaginatedCount,
    });
  });

  test("2. Returns error when an error occurs", async () => {
    const mockError = new Error("Something went wrong");

    // Mock the helpers to throw an error
    (FETCH_unpaginatedVocabCount as jest.Mock).mockRejectedValue(mockError);

    // Mock the TRANSFORM_error to return a specific error format
    (TRANSFORM_error as jest.Mock).mockReturnValue(
      "Error in FETCH_myVocabs: Something went wrong"
    );

    const result = await FETCH_vocabs(mockArgs);

    expect(result.error).toEqual(
      "Error in FETCH_myVocabs: Something went wrong"
    );
    expect(TRANSFORM_error).toHaveBeenCalledWith("FETCH_myVocabs", mockError);
  });

  test("3. Calls VALIDATE_args with correct arguments", async () => {
    await FETCH_vocabs(mockArgs);

    expect(VALIDATE_args).toHaveBeenCalledWith(mockArgs);
  });

  test("4. Handles undefined arguments gracefully", async () => {
    const result = await FETCH_vocabs(undefined as any);

    expect(result.error).toBeDefined();
  });

  test("5. Handles empty results gracefully", async () => {
    const mockUnpaginatedCount = 0;
    const mockVocabs: [] = [];

    // Mock the helpers
    (FETCH_unpaginatedVocabCount as jest.Mock).mockResolvedValue({
      unpaginated_COUNT: mockUnpaginatedCount,
    });
    (FETCH_finalVocabs as jest.Mock).mockResolvedValue({
      vocabs: mockVocabs,
    });

    const result = await FETCH_vocabs(mockArgs);

    expect(result.data).toEqual({
      vocabs: mockVocabs,
      unpaginated_COUNT: mockUnpaginatedCount,
    });
  });

  test("6. Throws error when query fails", async () => {
    const mockError = new Error("Query failed");

    // Mock the helpers to throw an error
    (FETCH_unpaginatedVocabCount as jest.Mock).mockRejectedValue(mockError);

    // Mock the TRANSFORM_error to return a specific error format
    (TRANSFORM_error as jest.Mock).mockReturnValue(
      "Error in FETCH_myVocabs: Query failed"
    );

    const result = await FETCH_vocabs(mockArgs);

    expect(result.error).toEqual("Error in FETCH_myVocabs: Query failed");
    expect(TRANSFORM_error).toHaveBeenCalledWith("FETCH_myVocabs", mockError);
  });
});
