//
//
//

import { USE_zustand } from "@/src/hooks";
import * as SecureStore from "expo-secure-store";

export function USE_clearUserContext() {
  const { z_SET_user } = USE_zustand();

  const CLEAR_userContext = async () => {
    await SecureStore.setItemAsync("user_id", "");
    z_SET_user(undefined);
  };

  return { CLEAR_userContext };
}
