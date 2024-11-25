//
// Tests for APPLY_supabaseListLanguageFilters
//

import APPLY_supabaseListLanguageFilters from "./APPLY_supabaseListLanguageFilters";

// Mock external dependencies
jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
    }),
  },
}));

describe("APPLY_supabaseListLanguageFilters", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("1. Returns the query unchanged if langFilters is undefined", () => {
    const mockQuery = {
      or: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListLanguageFilters(mockQuery);

    expect(mockQuery.or).not.toHaveBeenCalled();
    expect(result).toEqual(mockQuery);
  });

  it("2. Returns the query unchanged if langFilters is an empty array", () => {
    const mockQuery = {
      or: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListLanguageFilters(mockQuery, []);

    expect(mockQuery.or).not.toHaveBeenCalled();
    expect(result).toEqual(mockQuery);
  });

  it("3. Applies a single language filter correctly", () => {
    const mockQuery = {
      or: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListLanguageFilters(mockQuery, ["en"]);

    expect(mockQuery.or).toHaveBeenCalledWith("collected_lang_ids.ilike.%en%");
    expect(result).toEqual(mockQuery);
  });

  it("4. Applies multiple language filters correctly", () => {
    const mockQuery = {
      or: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListLanguageFilters(mockQuery, ["en", "de"]);

    expect(mockQuery.or).toHaveBeenCalledWith(
      "collected_lang_ids.ilike.%en%,collected_lang_ids.ilike.%de%"
    );
    expect(result).toEqual(mockQuery);
  });

  it("5. Doesn't filter when a single provided lang is an empty string", () => {
    const mockQuery = {
      or: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListLanguageFilters(mockQuery, [""]);

    expect(mockQuery.or).not.toHaveBeenCalled();
    expect(result).toEqual(mockQuery);
  });

  it("6. Handles a mix of valid and empty strings in langFilters", () => {
    const mockQuery = {
      or: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListLanguageFilters(mockQuery, [
      "en",
      "",
      "fr",
    ]);

    expect(mockQuery.or).toHaveBeenCalledWith(
      "collected_lang_ids.ilike.%en%,collected_lang_ids.ilike.%fr%"
    );
    expect(result).toEqual(mockQuery);
  });
});
