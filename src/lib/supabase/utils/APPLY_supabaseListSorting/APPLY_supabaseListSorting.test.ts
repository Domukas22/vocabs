import APPLY_supabaseListSorting from "./APPLY_supabaseListSorting";

// Mock external dependencies
jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    }),
  },
}));

describe("APPLY_supabaseListSorting", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("1. Applies default sorting by 'created_at' in descending order when no sorting is provided", () => {
    const mockQuery = {
      order: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListSorting(mockQuery);

    expect(mockQuery.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
    expect(result).toEqual(mockQuery);
  });

  it("2. Applies sorting by 'created_at' in descending order when sorting is 'date'", () => {
    const mockQuery = {
      order: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListSorting(mockQuery, "date");

    expect(mockQuery.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
    expect(result).toEqual(mockQuery);
  });

  it("3. Applies sorting by 'created_at' in ascending order when sortDirection is 'ascending'", () => {
    const mockQuery = {
      order: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListSorting(mockQuery, "date", "ascending");

    expect(mockQuery.order).toHaveBeenCalledWith("created_at", {
      ascending: true,
    });
    expect(result).toEqual(mockQuery);
  });

  it("4. Applies default sorting by 'created_at' in descending order when invalid sorting is provided", () => {
    const mockQuery = {
      order: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListSorting(mockQuery, "invalid" as any);

    expect(mockQuery.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
    expect(result).toEqual(mockQuery);
  });

  it("5. Handles undefined sortDirection by applying descending order by default", () => {
    const mockQuery = {
      order: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListSorting(mockQuery, "date");

    expect(mockQuery.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
    expect(result).toEqual(mockQuery);
  });
});
