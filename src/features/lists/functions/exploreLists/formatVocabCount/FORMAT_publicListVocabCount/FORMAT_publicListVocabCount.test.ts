//
//
//

import FORMAT_publicListVocabCount from "./FORMAT_publicListVocabCount"; // Import your function
import { FetchedSharedList_PROPS } from "../../props"; // Adjust the import path as necessary

describe("FORMAT_listVocabCount", () => {
  it("should return an empty array if lists is undefined or null", () => {
    expect(FORMAT_publicListVocabCount(undefined)).toEqual([]);
    expect(FORMAT_publicListVocabCount(null)).toEqual([]);
  });

  it("should return an empty array if lists is an empty array", () => {
    expect(FORMAT_publicListVocabCount([])).toEqual([]);
  });

  it("should assign vocab_COUNT as 0 when vocabs array is not present", () => {
    const input = [
      { id: "1", name: "List 1" } as FetchedSharedList_PROPS,
      { id: "2", name: "List 2" } as FetchedSharedList_PROPS,
    ];

    const result = FORMAT_publicListVocabCount(input);

    expect(result).toEqual([
      { id: "1", name: "List 1", vocab_COUNT: 0 },
      { id: "2", name: "List 2", vocab_COUNT: 0 },
    ]);
  });

  it("should correctly assign vocab_COUNT based on the first vocab's count", () => {
    const input = [
      {
        id: "1",
        name: "List 1",
        vocabs: [{ count: 5 }],
      } as FetchedSharedList_PROPS,
      {
        id: "2",
        name: "List 2",
        vocabs: [{ count: 10 }],
      } as FetchedSharedList_PROPS,
    ];

    const result = FORMAT_publicListVocabCount(input);

    expect(result).toEqual([
      expect.objectContaining({ id: "1", name: "List 1", vocab_COUNT: 5 }),
      expect.objectContaining({ id: "2", name: "List 2", vocab_COUNT: 10 }),
    ]);
  });

  it("should assign vocab_COUNT as 0 when vocabs array is empty", () => {
    const input = [
      {
        id: "1",
        name: "List 1",
        vocabs: [],
      } as unknown as FetchedSharedList_PROPS,
      {
        id: "2",
        name: "List 2",
        vocabs: [],
      } as unknown as FetchedSharedList_PROPS,
    ];

    const result = FORMAT_publicListVocabCount(input);

    expect(result).toEqual([
      expect.objectContaining({ id: "1", name: "List 1", vocab_COUNT: 0 }),
      expect.objectContaining({ id: "2", name: "List 2", vocab_COUNT: 0 }),
    ]);
  });
});
