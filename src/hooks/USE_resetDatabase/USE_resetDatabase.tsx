//
//
//

import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import db from "@/src/db";

export function USE_resetDatabase() {
  const { logout } = USE_auth();
  const router = useRouter();

  const RESET_database = async () => {
    const { error } = await logout();
    if (error) {
      Alert.alert("Logout error", "Error signing out");
    }
    await SecureStore.setItemAsync("user_id", "");
    router.push("/welcome");
    await db.write(async () => {
      await db.unsafeResetDatabase();
    });

    console.log("🟢 Database has been reset! 🟢");
  };

  return { RESET_database };
}
