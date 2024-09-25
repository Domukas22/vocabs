//
//
//

// zustand_store.js
import { create } from "zustand";
import { List_MODEL, Translation_MODEL, Vocab_MODEL } from "./db/models";
interface ZustandStore {
  lists_z: List_MODEL[];
  SET_lists_z: (fetchedLists: List_MODEL[]) => void;
  CREATE_privateList_z: (newLists: List_MODEL[]) => void;
  CREATE_privateVocab_z: (list_id: string, vocabData: Vocab_MODEL) => void;
  UPDATE_privateVocab_z: (
    list_id: string,
    vocab_id: string,
    updatedVocabData: Vocab_MODEL
  ) => void;
  DELETE_privateVocab_z: (list_id: string, vocab_id: string) => void;
}

const USE_zustandStore = create<ZustandStore>((set) => ({
  // State to store user lists with vocabs and translations
  lists_z: [],

  // Action to set lists (after fetching from the server)
  SET_lists_z: (fetchedLists) => set({ lists_z: fetchedLists }),

  CREATE_privateList_z: (newLists) => {
    set((state) => ({
      lists_z: [...newLists, ...state.lists_z], // Prepend new lists
    }));
  },
  CREATE_privateVocab_z: (list_id, vocabData) => {
    set((state) => ({
      lists_z: state.lists_z.map((list) => {
        if (list.id === list_id) {
          return {
            ...list,
            vocabs: [
              {
                ...vocabData,
              },
              ...(list.vocabs || []),
            ], // Prepend the new vocab with translations
          };
        }
        return list; // Return the list as is if it doesn't match
      }),
    }));
  },
  UPDATE_privateVocab_z: (list_id, vocab_id, updatedVocab) => {
    set((state) => ({
      lists_z: state.lists_z.map((list) => {
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
  DELETE_privateVocab_z: (list_id, vocab_id) => {
    set((state) => ({
      lists_z: state.lists_z.map((list) => {
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
}));

export default USE_zustandStore;
