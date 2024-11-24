//
//
//

import { Error_PROPS } from "@/src/props";

export type SupabaseListAccesses_DATA = {
  id: string;
  list_id: string;
  owner_id: string;
  participant_id: string;

  created_at: string;
  updated_at: string;
  deleted_at: string;
}[];

export type SupabaseListAccessesError_PROPS = Error_PROPS;

export type SupabaseListAccesses_RESPONSE = {
  data: SupabaseListAccesses_DATA;
  error?: SupabaseListAccessesError_PROPS;
};
