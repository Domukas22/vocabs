//
//
//

// zustand_store.js
import { create } from "zustand";
import { List_PROPS, Vocab_PROPS, Translation_PROPS } from "./db/props";

interface MyVocabDisplaySettings_PROPS {
  SHOW_description: boolean;
  SHOW_flags: boolean;
  SHOW_difficulty: boolean;
  frontTrLang_ID: string;
  sorting: "difficulty" | "date" | "shuffle"; // Example sorting options
  sortDirection: "ascending" | "descending";
  difficultyFilters: (1 | 2 | 3)[]; // Assuming the difficulty filters are represented by numbers
  langFilters: string[]; // Assuming language filters are represented by language codes or IDs as strings
}

interface ZustandStore {
  z_lists: List_PROPS[];
  z_SET_lists: (fetchedLists: List_PROPS[]) => void;

  z_printed_VOCABS: Vocab_PROPS[];
  z_SET_printedVocabs: (vocabs: Vocab_PROPS[]) => void;
  // z_ARE_printedVocabsLoading: boolean;
  // z_SET_printedVocabsLoading: (val: boolean) => void;

  z_display_SETTINGS: MyVocabDisplaySettings_PROPS;
  z_SET_displaySettings: (
    newSettings: Partial<MyVocabDisplaySettings_PROPS>
  ) => void;

  z_CREATE_privateList: (newLists: List_PROPS) => void;
  z_RENAME_privateList: (renamed_LIST: List_PROPS) => void;
  z_UPDATE_defaultListTRs: (
    targetList_ID: string,
    newDefaultTRs: string[]
  ) => void;
  z_DELETE_privateList: (targetList_ID: string) => void;
  z_CREATE_privateVocab: (new_VOCAB: Vocab_PROPS | undefined) => void;
  z_UPDATE_vocabDifficulty: (
    list_id: string,
    vocab_ID: string,
    new_DIFFICULTY: 1 | 2 | 3
  ) => void;
  z_UPDATE_privateVocab: (updated_VOCAB: Vocab_PROPS) => void;
  z_DELETE_privateVocab: (list_id: string, vocab_id: string) => void;
}

const USE_zustand = create<ZustandStore>((set) => ({
  // State to store user lists with vocabs and translations
  z_lists: [],
  z_SET_lists: (lists) => set({ z_lists: lists }), // only for initial fetch from server

  z_printed_VOCABS: [],
  z_SET_printedVocabs: (vocabs) => set({ z_printed_VOCABS: vocabs }),
  // z_ARE_printedVocabsLoading: false,
  // z_SET_printedVocabsLoading: (val) => set({ z_ARE_printedVocabsLoading: val }),

  z_display_SETTINGS: {
    SHOW_description: true,
    SHOW_flags: true,
    SHOW_difficulty: true,
    frontTrLang_ID: "en",
    sorting: "difficulty",
    sortDirection: "ascending",
    difficultyFilters: [],
    langFilters: [],
  },
  z_SET_displaySettings: (newSettings) => {
    set((state) => ({
      z_display_SETTINGS: {
        ...state.z_display_SETTINGS,
        ...newSettings,
      },
    }));
  },

  z_CREATE_privateList: (new_LIST) => {
    set((state) => ({
      z_lists: [new_LIST, ...state.z_lists], // Prepend new lists
    }));
  },
  z_RENAME_privateList: (renamed_LIST) => {
    set((state) => ({
      z_lists: state.z_lists.map((list) => {
        if (list.id === renamed_LIST.id) list.name = renamed_LIST.name;
        return list;
      }),
    }));
  },
  z_UPDATE_defaultListTRs: (targetList_ID, newDefaultTRs) => {
    set((state) => ({
      z_lists: state.z_lists.map((list) => {
        if (list.id === targetList_ID) list.default_LANGS = newDefaultTRs;
        return list;
      }),
    }));
  },
  z_DELETE_privateList: (targetList_ID) => {
    set((state) => ({
      z_lists: state.z_lists.filter((list) => list.id !== targetList_ID),
    }));
  },

  z_CREATE_privateVocab: (new_VOCAB) => {
    if (!new_VOCAB || !new_VOCAB.list_id) return;
    set((state) => ({
      z_lists: state.z_lists.map((list) => {
        if (list.id === new_VOCAB.list_id) {
          return {
            ...list,
            vocabs: [
              {
                ...new_VOCAB,
              },
              ...(list.vocabs || []),
            ], // Prepend the new vocab with translations
          };
        }
        return list; // Return the list as is if it doesn't match
      }),
    }));
    // ----------------------------------------------------------------
    set((state) => ({
      z_printed_VOCABS: [new_VOCAB, ...state.z_printed_VOCABS],
    }));
    // ----------------------------------------------------------------
  },
  z_UPDATE_privateVocab: (updated_VOCAB) => {
    set((state) => ({
      z_lists: state.z_lists.map((list) => {
        if (list.id === updated_VOCAB.list_id) {
          return {
            ...list,
            vocabs:
              list.vocabs?.map((vocab) =>
                vocab.id === updated_VOCAB.id ? updated_VOCAB : vocab
              ) || [], // Update the vocab if it matches
          };
        }
        return list; // Return the list as is if it doesn't match
      }),
    }));
    // ----------------------------------------------------------------
    set((state) => ({
      z_printed_VOCABS: state.z_printed_VOCABS.map((vocab) => {
        if (vocab.id === updated_VOCAB.id) return updated_VOCAB;
        return vocab;
      }),
    }));
    // ----------------------------------------------------------------
  },
  z_UPDATE_vocabDifficulty: (list_id, vocab_id, new_DIFFICULTY) => {
    set((state) => ({
      z_lists: state.z_lists.map((list) => {
        if (list.id === list_id) {
          return {
            ...list,
            vocabs: list.vocabs?.map((vocab) => {
              if (vocab.id === vocab_id) {
                vocab.difficulty = new_DIFFICULTY;
              }
              return vocab;
            }),
          };
        }
        return list; // Return the list as is if it doesn't match
      }),
    }));
    // ----------------------------------------------------------------
    set((state) => ({
      z_printed_VOCABS: state.z_printed_VOCABS.map((vocab) => {
        if (vocab.id === vocab_id) vocab.difficulty = new_DIFFICULTY;
        return vocab;
      }),
    }));
    // ----------------------------------------------------------------
  },
  z_DELETE_privateVocab: (list_id, vocab_id) => {
    set((state) => ({
      z_lists: state.z_lists.map((list) => {
        if (list.id === list_id) {
          return {
            ...list,
            vocabs: list.vocabs?.filter((vocab) => vocab.id !== vocab_id) || [], // Filter out the vocab to delete
          };
        }
        return list; // Return the list as is if it doesn't match
      }),
    }));
    // ----------------------------------------------------------------
    set((state) => ({
      z_printed_VOCABS: state.z_printed_VOCABS.filter((v) => v.id !== vocab_id),
    }));
    // ----------------------------------------------------------------
  },
}));

export default USE_zustand;
