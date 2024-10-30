import * as SecureStore from "expo-secure-store";

export default async function GET_userId() {
  return await SecureStore.getItemAsync("user_id");
}
