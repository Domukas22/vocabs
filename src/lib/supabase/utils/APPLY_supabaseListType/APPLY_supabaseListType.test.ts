//
//
//

import APPLY_supabaseListType from "./APPLY_supabaseListType";

// Mock external dependencies
jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
    }),
  },
}));

describe("APPLY_supabaseListType", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("1. Returns query with 'typeUndefined' type if type is neither 'shared' nor 'public'", () => {
    const mockQuery = {
      eq: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListType(mockQuery, "somethingStrange", [
      "list1",
      "list2",
    ]);

    expect(mockQuery.eq).toHaveBeenCalledWith("type", "typeUndefined");
    expect(result).toEqual(mockQuery);
  });

  it("2. Returns query with the 'public' type if type is 'public'", () => {
    const mockQuery = {
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListType(mockQuery, "public", []);

    expect(mockQuery.eq).toHaveBeenCalledWith("type", "public");
    expect(result).toEqual(mockQuery);
  });
  it("3. Returns query with the 'shared' type if type is 'shared'", () => {
    const mockQuery = {
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListType(mockQuery, "shared", []);

    expect(mockQuery.eq).toHaveBeenCalledWith("type", "shared");
    expect(result).toEqual(mockQuery);
  });

  it("4. Returns query with the 'shared' type if list_ids is undefined and type is 'shared'", () => {
    const mockQuery = {
      eq: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListType(mockQuery, "shared", undefined);

    expect(mockQuery.eq).toHaveBeenCalledWith("type", "shared");
    expect(result).toEqual(mockQuery);
  });
  it("5. Returns query with the 'shared' type if list_ids is null and type is 'shared'", () => {
    const mockQuery = {
      eq: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListType(mockQuery, "shared", null);

    expect(mockQuery.eq).toHaveBeenCalledWith("type", "shared");
    expect(result).toEqual(mockQuery);
  });

  it("7. Does not add an 'in' clause if list_ids are not provided for type 'shared'", () => {
    const mockQuery = {
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListType(mockQuery, "shared", []);

    expect(mockQuery.eq).toHaveBeenCalledWith("type", "shared");
    expect(mockQuery.in).not.toHaveBeenCalled();
    expect(result).toEqual(mockQuery);
  });

  it("8. Returns query with the correct type and list_ids when type is 'shared' and list_ids are populated", () => {
    const mockQuery = {
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
    };

    const result = APPLY_supabaseListType(mockQuery, "shared", [
      "list1",
      "list2",
    ]);

    expect(mockQuery.eq).toHaveBeenCalledWith("type", "shared");
    expect(mockQuery.in).toHaveBeenCalledWith("id", ["list1", "list2"]);
    expect(result).toEqual(mockQuery);
  });
});
