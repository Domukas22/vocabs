import * as SecureStore from "expo-secure-store";

export default async function GET_userId() {
  const userId = await SecureStore.getItemAsync("user_id");
  console.log(userId); // or use it as needed
}
