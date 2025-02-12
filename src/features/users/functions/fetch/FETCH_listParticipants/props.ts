//
//
//

import { Error_PROPS } from "@/src/types/error_TYPES";

export type ListParticipants_DATA =
  | {
      id: any;
      username: any;
    }[]
  | null;

export type ListParticipants_ARGS = {
  list_id: string | undefined;
  owner_id: string | undefined;
};

export type ListParticipantsError_PROPS = Error_PROPS;

export type ListParticipants_RESPONSE = {
  data: ListParticipants_DATA;
  error?: ListParticipantsError_PROPS;
};

// 🔴🔴 TODO 🔴🔴
// ----> create  a try/catch block inside "FETCH_supabaseLists"
