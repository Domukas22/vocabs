//
//
//

import FETCH_allSupabaseLists from "./FETCH_allSupabaseLists";
import FETCH_allSupabaseNotifications from "./FETCH_allSupabaseNotifications";
import FETCH_allSupabasePayments from "./FETCH_allSupabasePayments";
import FETCH_allSupabaseVocabs from "./FETCH_allSupabaseVocabs";
import FETCH_watermelonUser from "./FETCH_watermelonUser";

import FETCH_supabaseUser from "./FETCH_supabaseUser";

import SYNC_ListsWithSupabase from "./SYNC_ListsWithSupabase";
import SYNC_vocabsWithSupabase from "./SYNC_VocabsWithSupabase";

export default async function SYNC_allFromSupabase(
  user_id: string | undefined
) {
  if (!user_id) return;

  //  ----------------------------------------------------------------
  // Fetch supabase data
  const {
    success: supabaseUser_SUCCESS,
    data: supabase_USER,
    error: supabaseUser_ERROR,
  } = await FETCH_supabaseUser(user_id);
  const {
    success: supabaseLists_SUCCESS,
    data: supabase_LISTS,
    error: supabaseLists_ERROR,
  } = await FETCH_allSupabaseLists(user_id);
  const {
    success: supabaseVocabs_SUCCESS,
    data: supabase_VOCABS,
    error: supabaseVocabs_ERROR,
  } = await FETCH_allSupabaseVocabs(user_id);

  const {
    success: supabasePayments_SUCCESS,
    data: supabase_PAYMENTS,
    error: supabasePaymentss_ERROR,
  } = await FETCH_allSupabasePayments(user_id);
  const {
    success: supabaseNotifications_SUCCESS,
    data: supabase_NOTIFICATIONS,
    error: supabaseNotifications_ERROR,
  } = await FETCH_allSupabaseNotifications(user_id);

  //  ----------------------------------------------------------------
  // Populate watermelon data
  // 🔴 Make sure you first fetch and populate in this order ---> user, lists, vocabs 🔴
  const {
    success: watermelonUser_SUCCESS,
    data: watermelon_USER,
    error: watermelonUser_ERROR,
  } = await FETCH_watermelonUser(user_id);

  const ALLOW_listSync =
    watermelonUser_SUCCESS &&
    supabaseLists_SUCCESS &&
    watermelon_USER &&
    supabase_LISTS;

  const ALLOW_vocabSync =
    watermelonUser_SUCCESS &&
    supabaseLists_SUCCESS &&
    supabaseVocabs_SUCCESS &&
    watermelon_USER &&
    supabase_LISTS &&
    supabase_VOCABS;

  if (ALLOW_listSync) {
    await SYNC_ListsWithSupabase({
      supabase_LISTS,
      watermelon_USER: watermelon_USER,
    });
  }

  if (ALLOW_vocabSync) {
    await SYNC_vocabsWithSupabase({
      supabase_VOCABS,
      watermelon_USER: watermelon_USER,
    });
  }
}
