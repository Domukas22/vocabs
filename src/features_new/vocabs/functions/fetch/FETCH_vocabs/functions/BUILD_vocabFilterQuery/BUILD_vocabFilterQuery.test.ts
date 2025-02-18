import { FETCH_myVocabs_ARG_TYPES, VocabQuery_TYPE } from "../../types";
import { BUILD_vocabFilterQuery } from "./BUILD_vocabFilterQuery";

describe("BUILD_vocabFilterQuery", () => {
  let mockQuery: VocabQuery_TYPE;

  beforeEach(() => {
    mockQuery = {
      filters: [],
      filter: jest.fn(function (this: any, key, operator, value) {
        this.filters.push({ key, operator, value });
        return this;
      }),
      or: jest.fn(function (this: any, condition) {
        this.filters.push({ or: condition });
        return this;
      }),
    } as unknown as VocabQuery_TYPE;
  });

  test("1. Applies user_id filter when list_TYPE is private", () => {
    const args = {
      list_TYPE: "private",
      user_id: "123",
      fetch_TYPE: "all",
      search: "",
      excludeIds: new Set(),
      difficultyFilters: [],
      langFilters: [],
    } as unknown as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_vocabFilterQuery(mockQuery, args);
    expect(result.filter).toHaveBeenCalledWith("user_id", "eq", "123");
  });

  test("2. Applies difficulty filter when difficultyFilters is not empty", () => {
    const args = {
      list_TYPE: "private",
      user_id: "123",
      difficultyFilters: [1, 2],
      fetch_TYPE: "all",
      search: "",
      excludeIds: new Set(),
      langFilters: [],
    } as unknown as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_vocabFilterQuery(mockQuery, args);
    expect(result.filter).toHaveBeenCalledWith("difficulty", "in", "(1,2)");
  });

  test("3. Does not apply difficulty filter when difficultyFilters is empty", () => {
    const args = {
      list_TYPE: "private",
      user_id: "123",
      difficultyFilters: [],
      fetch_TYPE: "all",
      search: "",
      excludeIds: new Set(),
      langFilters: [],
    } as unknown as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_vocabFilterQuery(mockQuery, args);
    expect(result.filter).not.toHaveBeenCalledWith(
      "difficulty",
      "in",
      expect.any(String)
    );
  });

  test("4. Applies correct fetch_TYPE filters", () => {
    const fetchTypes = {
      all: ["deleted_at", "is", null],
      byTargetList: ["deleted_at", "is", null],
      deleted: ["deleted_at", "not.is", null],
      marked: ["deleted_at", "is", null],
    };

    for (const [fetchType, expectedFilter] of Object.entries(fetchTypes)) {
      mockQuery.filter.mockClear();
      const args = {
        list_TYPE: "private",
        user_id: "123",
        difficultyFilters: [],
        fetch_TYPE: fetchType as any,
        search: "",
        excludeIds: new Set(),
        langFilters: [],
      } as unknown as FETCH_myVocabs_ARG_TYPES;

      const result = BUILD_vocabFilterQuery(mockQuery, args);
      expect(result.filter).toHaveBeenCalledWith(...expectedFilter);
    }
  });

  test("5. Applies targetList_ID filter when fetch_TYPE is byTargetList", () => {
    const args = {
      list_TYPE: "private",
      user_id: "123",
      difficultyFilters: [],
      fetch_TYPE: "byTargetList",
      targetList_ID: "456",
      search: "",
      excludeIds: new Set(),
      langFilters: [],
    } as unknown as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_vocabFilterQuery(mockQuery, args);
    expect(result.filter).toHaveBeenCalledWith("list_id", "eq", "456");
  });

  test("6. Applies langFilters correctly when not empty", () => {
    const args = {
      list_TYPE: "private",
      user_id: "123",
      difficultyFilters: [],
      fetch_TYPE: "all",
      search: "",
      excludeIds: new Set(),
      langFilters: ["en", "fr"],
    } as unknown as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_vocabFilterQuery(mockQuery, args);
    expect(result.or).toHaveBeenCalledWith(
      "lang_ids.ilike.%en%,lang_ids.ilike.%fr%"
    );
  });

  test("7. Does not apply langFilters when empty", () => {
    const args = {
      list_TYPE: "private",
      user_id: "123",
      difficultyFilters: [],
      fetch_TYPE: "all",
      search: "",
      excludeIds: new Set(),
      langFilters: [],
    } as unknown as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_vocabFilterQuery(mockQuery, args);
    expect(result.or).not.toHaveBeenCalled();
  });

  test("8. Applies search filter when search is not empty", () => {
    const args = {
      list_TYPE: "private",
      user_id: "123",
      difficultyFilters: [],
      fetch_TYPE: "all",
      search: "apple",
      excludeIds: new Set(),
      langFilters: [],
    } as unknown as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_vocabFilterQuery(mockQuery, args);
    expect(result.or).toHaveBeenCalledWith(
      "description.ilike.%apple%,searchable.ilike.%apple%"
    );
  });

  test("9. Does not apply search filter when search is empty", () => {
    const args = {
      list_TYPE: "private",
      user_id: "123",
      difficultyFilters: [],
      fetch_TYPE: "all",
      search: "",
      excludeIds: new Set(),
      langFilters: [],
    } as unknown as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_vocabFilterQuery(mockQuery, args);
    expect(result.or).not.toHaveBeenCalledWith(
      expect.stringContaining("ilike")
    );
  });

  test("10. Excludes printed vocabs if EXCLUDE_printed is true", () => {
    const excludeIds = new Set(["1", "2", "3"]);
    const args = {
      list_TYPE: "private",
      user_id: "123",
      difficultyFilters: [],
      fetch_TYPE: "all",
      search: "",
      excludeIds,
      langFilters: [],
    } as unknown as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_vocabFilterQuery(mockQuery, args, true);
    expect(result.filter).toHaveBeenCalledWith("id", "not.in", "(1,2,3)");
  });

  test("11. Does not exclude printed vocabs if EXCLUDE_printed is false", () => {
    const excludeIds = new Set(["1", "2", "3"]);
    const args = {
      list_TYPE: "private",
      user_id: "123",
      difficultyFilters: [],
      fetch_TYPE: "all",
      search: "",
      excludeIds,
      langFilters: [],
    } as unknown as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_vocabFilterQuery(mockQuery, args, false);
    expect(result.filter).not.toHaveBeenCalledWith(
      "id",
      "not.in",
      expect.any(String)
    );
  });

  test("12. Throws error if query is undefined", () => {
    expect(() => BUILD_vocabFilterQuery(undefined as any, {} as any)).toThrow(
      "'query' undefined when building vocab filters"
    );
  });

  test("13. Handles missing properties in args gracefully", () => {
    const args = {} as any;
    const result = BUILD_vocabFilterQuery(mockQuery, args);
    expect(result.filter).toHaveBeenCalled();
  });
  test("14. Applies is_public filter when list_TYPE is public", () => {
    const args = {
      list_TYPE: "public",
      user_id: "123",
      difficultyFilters: [],
      fetch_TYPE: "all",
      search: "",
      excludeIds: new Set(),
      langFilters: [],
    } as unknown as FETCH_myVocabs_ARG_TYPES;

    const result = BUILD_vocabFilterQuery(mockQuery, args);
    expect(result.filter).toHaveBeenCalledWith("is_public", "eq", true);
  });
});
