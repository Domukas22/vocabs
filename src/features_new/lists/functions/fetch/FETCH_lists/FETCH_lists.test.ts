import { supabase } from "@/src/lib/supabase";
import { FETCH_lists_ARGS } from "./types";
import {
  FETCH_unpaginatedListCount,
  FETCH_finalLists,
  VALIDATE_fetchListsArgs,
} from "./helpers";
import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_vocabs } from "./FETCH_lists";

jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
  },
}));

jest.mock("./helpers", () => ({
  FETCH_unpaginatedVocabCount: jest.fn(),
  FETCH_finalVocabs: jest.fn(),
  VALIDATE_fetchVocabArgs: jest.fn(),
}));

describe("FETCH_vocabs", () => {
  let mockArgs: FETCH_lists_ARGS;

  beforeEach(() => {
    mockArgs = {
      sorting: "date",
      sortDirection: "ascending",
    } as FETCH_lists_ARGS;

    jest.clearAllMocks(); // Reset mocks before each test
  });

  test("1. Fetches vocabs successfully with valid args", async () => {
    const mockVocabs = [{ id: 1, name: "Vocab1" }];
    const mockUnpaginatedCount = 10;

    // Mock the helpers
    (FETCH_unpaginatedListCount as jest.Mock).mockResolvedValue({
      unpaginated_COUNT: mockUnpaginatedCount,
    });
    (FETCH_finalLists as jest.Mock).mockResolvedValue({
      vocabs: mockVocabs,
    });

    // Mock the Supabase query
    (supabase.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn().mockResolvedValueOnce({ data: mockVocabs }),
    });

    const result = await FETCH_vocabs(mockArgs);

    expect(result).toEqual({
      vocabs: mockVocabs,
      unpaginated_COUNT: mockUnpaginatedCount,
    });
  });

  test("2. Throws General_ERROR when an error occurs", async () => {
    const mockError = new Error("Something went wrong");

    // Mock the helpers to throw an error
    (FETCH_unpaginatedListCount as jest.Mock).mockRejectedValueOnce(mockError);

    try {
      await FETCH_vocabs(mockArgs);
    } catch (error) {
      expect(error).toBeInstanceOf(General_ERROR);
      expect((error as General_ERROR).message).toBe("Something went wrong");
      expect((error as General_ERROR).function_NAME).toBe("FETCH_myVocabs");
    }
  });

  test("3. Calls VALIDATE_fetchVocabArgs with correct arguments", async () => {
    await FETCH_vocabs(mockArgs);

    expect(VALIDATE_fetchListsArgs).toHaveBeenCalledWith(mockArgs);
  });

  test("4. Handles undefined arguments gracefully", async () => {
    try {
      await FETCH_vocabs(undefined as any);
    } catch (error) {
      expect(error).toBeInstanceOf(General_ERROR);
      expect((error as General_ERROR).message).toBeDefined();
    }
  });

  test("5. Handles empty results gracefully", async () => {
    const mockUnpaginatedCount = 0;
    const mockVocabs: [] = [];

    // Mock the helpers
    (FETCH_unpaginatedListCount as jest.Mock).mockResolvedValue({
      unpaginated_COUNT: mockUnpaginatedCount,
    });
    (FETCH_finalLists as jest.Mock).mockResolvedValue({
      vocabs: mockVocabs,
    });

    const result = await FETCH_vocabs(mockArgs);

    expect(result).toEqual({
      vocabs: mockVocabs,
      unpaginated_COUNT: mockUnpaginatedCount,
    });
  });

  test("6. Throws General_ERROR when query fails", async () => {
    const mockError = new Error("Query failed");

    // Mock the helpers to throw an error
    (FETCH_unpaginatedListCount as jest.Mock).mockRejectedValueOnce(mockError);

    try {
      await FETCH_vocabs(mockArgs);
    } catch (error) {
      expect(error).toBeInstanceOf(General_ERROR);
      expect((error as General_ERROR).message).toBe("Query failed");
      expect((error as General_ERROR).function_NAME).toBe("FETCH_myVocabs");
    }
  });
});
