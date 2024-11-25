import APPLY_supabasePagination from "./APPLY_supabasePagination";

describe("APPLY_supabasePagination", () => {
  let mockQuery: any;

  beforeEach(() => {
    mockQuery = {
      range: jest.fn().mockReturnThis(),
    };
  });

  it("1. Returns range(0, 0) when end - 1 is less than start", () => {
    const result = APPLY_supabasePagination(mockQuery, 5, 3);
    expect(mockQuery.range).toHaveBeenCalledWith(0, 0);
    expect(result).toEqual(mockQuery);
  });

  it("2. Returns range(0, 0) when start equals end", () => {
    const result = APPLY_supabasePagination(mockQuery, 3, 3);
    expect(mockQuery.range).toHaveBeenCalledWith(0, 0);
    expect(result).toEqual(mockQuery);
  });

  it("3. Calls range with valid start and end-1 when end > start", () => {
    const result = APPLY_supabasePagination(mockQuery, 0, 5);
    expect(mockQuery.range).toHaveBeenCalledWith(0, 4);
    expect(result).toEqual(mockQuery);
  });

  it("4. Works for larger ranges with valid inputs", () => {
    const result = APPLY_supabasePagination(mockQuery, 10, 20);
    expect(mockQuery.range).toHaveBeenCalledWith(10, 19);
    expect(result).toEqual(mockQuery);
  });

  it("5. Consistently returns the same query object passed to it, regardless of the input arguments", () => {
    const result = APPLY_supabasePagination(mockQuery, 7, 12);
    expect(result).toBe(mockQuery);
  });

  it("6. Does not throw when end is less than start", () => {
    expect(() => APPLY_supabasePagination(mockQuery, 10, 7)).not.toThrow();
    expect(mockQuery.range).toHaveBeenCalledWith(0, 0);
  });
});
