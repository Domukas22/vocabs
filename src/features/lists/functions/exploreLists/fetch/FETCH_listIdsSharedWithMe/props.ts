//
//
//

import { Error_PROPS } from "@/src/types/error_TYPES";

export type ListIdsSharedWithMe_DATA =
  | {
      list_id: any;
    }[]
  | null;

export type ListIdsSharedWithMeError_PROPS = Error_PROPS;

export type ListIdsSharedWithMe_RESPONSE = {
  data: ListIdsSharedWithMe_DATA;
  error?: ListIdsSharedWithMeError_PROPS;
};
