//
//
//
import BUILD_fetchMyVocabsFilterConditions from "./BUILD_fetchMyVocabsFilterConditions";
import { Q } from "@nozbe/watermelondb";
import { notEq } from "@nozbe/watermelondb/QueryDescription";
import { FETCH_myVocabs_ARG_TYPES } from "../../../types";

describe("BUILD_fetchMyVocabsFilterConditions", () => {
  // 1. Returns default conditions for 'allVocabs'
  it('1. Returns default conditions for "allVocabs"', () => {
    const args = {
      type: "allVocabs",
      user_id: "user_123",
      z_vocabDisplay_SETTINGS: {},
    } as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsFilterConditions(args);

    expect(result).toEqual(
      Q.and(Q.where("user_id", "user_123"), Q.where("deleted_at", null))
    );
  });

  // 2. Returns conditions for 'byTargetList'
  it('2. Returns conditions for "byTargetList"', () => {
    const args = {
      type: "byTargetList",
      user_id: "user_123",
      targetList_ID: "target_456",
      z_vocabDisplay_SETTINGS: {},
    } as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsFilterConditions(args);

    expect(result).toEqual(
      Q.and(
        Q.where("user_id", "user_123"),
        Q.where("deleted_at", null),
        Q.where("list_id", "target_456")
      )
    );
  });

  // 3. Handles "deletedVocabs" correctly
  it('3. Handles "deletedVocabs" correctly', () => {
    const args = {
      type: "deletedVocabs",
      user_id: "user_123",
      z_vocabDisplay_SETTINGS: {},
    } as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsFilterConditions(args);

    expect(result).toEqual(
      Q.and(Q.where("user_id", "user_123"), Q.where("deleted_at", notEq(null)))
    );
  });

  // 4. Handles "marked" correctly
  it('4. Handles "marked" correctly', () => {
    const args = {
      type: "marked",
      user_id: "user_123",
      z_vocabDisplay_SETTINGS: {},
    } as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsFilterConditions(args);

    expect(result).toEqual(
      Q.and(
        Q.where("user_id", "user_123"),
        Q.where("deleted_at", null),
        Q.where("is_marked", true)
      )
    );
  });

  // 5. Handles missing or empty difficulty filters
  it("5. Handles missing or empty difficulty filters", () => {
    const args = {
      user_id: "user_123",
      z_vocabDisplay_SETTINGS: { difficultyFilters: [] } as any,
    } as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsFilterConditions(args);

    expect(result).toEqual(
      Q.and(Q.where("user_id", "user_123"), Q.where("deleted_at", null))
    );
  });

  // 6. Handles valid difficulty filters
  it("6. Handles valid difficulty filters", () => {
    const args = {
      user_id: "user_123",
      z_vocabDisplay_SETTINGS: { difficultyFilters: [1, 2] } as any,
    } as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsFilterConditions(args);

    expect(result).toEqual(
      Q.and(
        Q.where("user_id", "user_123"),
        Q.where("deleted_at", null),
        Q.where("difficulty", Q.oneOf([1, 2]))
      )
    );
  });

  // 7. Handles language filters
  it("7. Handles language filters", () => {
    const args = {
      user_id: "user_123",
      z_vocabDisplay_SETTINGS: { langFilters: ["en", "de"] } as any,
    } as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsFilterConditions(args);

    expect(result).toEqual(
      Q.and(
        Q.where("user_id", "user_123"),
        Q.where("deleted_at", null),
        Q.or([
          Q.where("lang_ids", Q.like("%en%")),
          Q.where("lang_ids", Q.like("%de%")),
        ])
      )
    );
  });

  // 8. Handles search filtering
  it("8. Handles search filtering correctly", () => {
    const args = {
      user_id: "user_123",
      search: "apple",
      z_vocabDisplay_SETTINGS: {},
    } as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsFilterConditions(args);

    expect(result).toEqual(
      Q.and(
        Q.where("user_id", "user_123"),
        Q.where("deleted_at", null),
        Q.or([
          Q.where("description", Q.like("%apple%")),
          Q.where("searchable", Q.like("%apple%")),
        ])
      )
    );
  });

  // 9. Handles excludeIds filtering
  it("9. Handles excludeIds filtering correctly", () => {
    const args = {
      user_id: "user_123",
      excludeIds: new Set([1, 2, 3]),
      z_vocabDisplay_SETTINGS: {},
    } as unknown as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsFilterConditions(args);

    expect(result).toEqual(
      Q.and(
        Q.where("user_id", "user_123"),
        Q.where("deleted_at", null),
        Q.where("id", Q.notIn([1, 2, 3]))
      )
    );
  });

  // 10. Handles edge case with empty 'args' object
  it('10. Handles edge case with empty "args" object', () => {
    const args = {} as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsFilterConditions(args);

    expect(result).toEqual(
      Q.and(Q.where("user_id", ""), Q.where("deleted_at", null))
    );
  });

  // 11. Handles undefined or missing fields gracefully
  it("11. Handles undefined or missing fields gracefully", () => {
    const args = {
      user_id: "user_123",
    } as FETCH_myVocabs_ARG_TYPES;
    const result = BUILD_fetchMyVocabsFilterConditions(args);

    expect(result).toEqual(
      Q.and(Q.where("user_id", "user_123"), Q.where("deleted_at", null))
    );
  });
});
