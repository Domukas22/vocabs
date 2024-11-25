import { CREATE_internalErrorMsg } from "@/src/constants/globalVars";
import { Error_PROPS } from "@/src/props";
import { z_listDisplaySettings_PROPS } from "@/src/zustand";

export const fetchSupabaseLists_ERRS = {
  internal: {
    listIdsUndefined: "list_ids undefined when fetching supabase lists",
    inproperListType:
      "The provided 'list.type' when fetching supabase lists was neither 'shared' nor 'public'",
    failedSupabaseFetch: "Failed to fetch supabase lists",
  },
  user: {
    defaultInternal_MSG: CREATE_internalErrorMsg("trying to load lists"),
    networkFailure: "There seems to an issue with your internet connection.",
  },
};

export interface FetchSupabaseLists_ARGS {
  search?: string;
  list_ids?: string[] | null;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS | undefined;
  start?: number; // New parameter for start index
  end?: number; // New parameter for end index
  signal: AbortSignal;
  type: "public" | "shared";
}

export type FetchSupabaseListsError_PROPS = Error_PROPS;
export type FetchSupabaseLists_DATA = {
  lists:
    | {
        id: any;
        name: any;
        description: any;
        collected_lang_ids: any;
        username: any;
        vocabs: {
          count: any;
        }[];
      }[]
    | null;
  count: number;
};

export type ListParticipants_RESPONSE = {
  data: FetchSupabaseLists_DATA;
  error?: FetchSupabaseListsError_PROPS;
};
