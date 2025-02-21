//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_arrow } from "@/src/components/1_grouped/icons/icons";
import { useRouter } from "expo-router";

export function NavBack_BTN() {
  const router = useRouter();
  return (
    <Btn
      onPress={() => router.back()}
      iconLeft={<ICON_arrow direction="left" />}
      style={{ flex: 1 }}
    />
  );
}
