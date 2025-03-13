//
//
//

import { myVocabsSorting_TYPE } from "../../z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";

export function SET_sorting(sorting_TYPE: myVocabsSorting_TYPE) {
  return (state: any) => ({
    sorting: {
      ...state.sorting,
      type: sorting_TYPE,
    },
  });
}
