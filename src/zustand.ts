//
//
//

// zustand_store.js
import { create } from "zustand";
import { List_MODEL, Vocab_MODEL, Translation_MODEL } from "./db/models";
interface ZustandStore {
  z_lists: List_MODEL[];
  z_SET_lists: (fetchedLists: List_MODEL[]) => void;
  z_ARE_listsLoading: boolean;
  z_SET_listsLoading: (bool: boolean) => void;
  z_lists_ERROR: any;
  z_SET_listsError: (error: any) => void;

  z_CREATE_privateList: (newLists: List_MODEL) => void;
  z_RENAME_privateList: (targetList_ID: string, new_NAME: string) => void;
  z_UPDATE_defaultListTRs: (
    targetList_ID: string,
    newDefaultTRs: string[]
  ) => void;
  z_DELETE_privateList: (targetList_ID: string) => void;

  z_CREATE_privateVocab: (new_VOCAB: Vocab_MODEL | undefined) => void;
  z_UPDATE_vocabDifficulty: (
    list_id: string,
    vocab_ID: string,
    new_DIFFICULTY: 1 | 2 | 3
  ) => void;
  z_UPDATE_privateVocab: (
    list_id: string,
    vocab_id: string,
    updatedVocabData: Vocab_MODEL
  ) => void;
  z_DELETE_privateVocab: (list_id: string, vocab_id: string) => void;

  z_publicVocabs: Vocab_MODEL[];
  z_SET_publicVocabs: (lists: Vocab_MODEL[]) => void;
  z_ARE_publicVocabsLoading: boolean;
  z_SET_publicVocabsLoading: (bool: boolean) => void;
  z_publicVocabs_ERROR: any;
  z_SET_publicVocabsError: (error: any) => void;

  z_CREATE_publicVocab: (new_VOCAB: Vocab_MODEL) => void;
  z_UPDATE_publicVocab: ({
    vocab_id,
    updatedVocabData,
  }: {
    vocab_id: string;
    updatedVocabData: Vocab_MODEL;
  }) => void;
  z_DELETE_publicVocab: ({
    targetVocab_ID,
  }: {
    targetVocab_ID: string;
  }) => void;
}

const USE_zustand = create<ZustandStore>((set) => ({
  // State to store user lists with vocabs and translations
  z_lists: [],
  z_SET_lists: (lists) => set({ z_lists: lists }), // only for initial fetch from server

  z_ARE_listsLoading: false,
  z_SET_listsLoading: (bool) => set({ z_ARE_listsLoading: bool }),

  z_lists_ERROR: null,
  z_SET_listsError: (error) => set({ z_lists_ERROR: error }),

  z_CREATE_privateList: (new_LIST) => {
    set((state) => ({
      z_lists: [new_LIST, ...state.z_lists], // Prepend new lists
    }));
  },
  z_RENAME_privateList: (targetList_ID, new_NAME) => {
    set((state) => ({
      z_lists: state.z_lists.map((list) => {
        if (list.id === targetList_ID) list.name = new_NAME;
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
  },
  z_UPDATE_privateVocab: (list_id, vocab_id, updatedVocab) => {
    set((state) => ({
      z_lists: state.z_lists.map((list) => {
        if (list.id === list_id) {
          return {
            ...list,
            vocabs:
              list.vocabs?.map((vocab) =>
                vocab.id === vocab_id ? updatedVocab : vocab
              ) || [], // Update the vocab if it matches
          };
        }
        return list; // Return the list as is if it doesn't match
      }),
    }));
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
  },

  z_publicVocabs: [],
  z_SET_publicVocabs: (vocabs) => set({ z_publicVocabs: vocabs }), // only for initial fetch from server

  z_ARE_publicVocabsLoading: false,
  z_SET_publicVocabsLoading: (bool) => set({ z_ARE_listsLoading: bool }),

  z_publicVocabs_ERROR: null,
  z_SET_publicVocabsError: (error) => set({ z_lists_ERROR: error }),

  z_CREATE_publicVocab: (new_VOCAB) => {
    set((state) => ({
      z_publicVocabs: [new_VOCAB, ...state.z_publicVocabs],
    }));
  },
  z_UPDATE_publicVocab: ({ vocab_id, updatedVocabData }) => {
    set((state) => ({
      z_publicVocabs: state.z_publicVocabs.map((vocab) => {
        if (vocab.id === vocab_id) {
          return updatedVocabData;
        }
        return vocab;
      }),
    }));
  },
  z_DELETE_publicVocab: ({ targetVocab_ID }) => {
    set((state) => ({
      z_publicVocabs: state.z_publicVocabs.filter(
        (v) => v?.id !== targetVocab_ID
      ),
    }));
  },
}));

export default USE_zustand;
