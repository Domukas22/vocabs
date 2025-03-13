//
//
//

import { sortDirection_TYPE } from "@/src/types/general_TYPES";

export function SET_sortDirection(sortDirection_TYPE: sortDirection_TYPE) {
  return (state: any) => ({
    sorting: {
      ...state.sorting,
      direction: sortDirection_TYPE,
    },
  });
}
