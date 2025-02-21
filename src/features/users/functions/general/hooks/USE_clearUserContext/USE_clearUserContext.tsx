//
//
//

import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import * as SecureStore from "expo-secure-store";

export function USE_clearUserContext() {
  const { z_SET_user } = z_USE_user();

  const CLEAR_userContext = async () => {
    await SecureStore.setItemAsync("user_id", "");
    z_SET_user(undefined);
  };

  return { CLEAR_userContext };
}
