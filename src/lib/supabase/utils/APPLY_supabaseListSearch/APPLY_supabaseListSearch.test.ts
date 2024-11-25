//
//
//

import APPLY_supabaseListSearch from "./APPLY_supabaseListSearch";

// Mock external dependencies
jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
    }),
  },
}));

describe("APPLY_supabaseListSearch", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("1. Returns the query unchanged when no search term is provided", () => {
    const mockQuery = {
      or: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListSearch(mockQuery);

    expect(mockQuery.or).not.toHaveBeenCalled();
    expect(result).toEqual(mockQuery);
  });

  it("2. Returns query with 'name' and 'description' filters when a search term is provided", () => {
    const mockQuery = {
      or: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListSearch(mockQuery, "test");

    expect(mockQuery.or).toHaveBeenCalledWith(
      "name.ilike.%test%,description.ilike.%test%"
    );
    expect(result).toEqual(mockQuery);
  });

  it("3. Handles a case where the search term is an empty string", () => {
    const mockQuery = {
      or: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListSearch(mockQuery, "");

    expect(mockQuery.or).not.toHaveBeenCalled();
    expect(result).toEqual(mockQuery);
  });
});
