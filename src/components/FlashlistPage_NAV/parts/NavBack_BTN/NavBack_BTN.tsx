//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_arrow,
  ICON_arrow2,
} from "@/src/components/1_grouped/icons/icons";
import { useRouter } from "expo-router";

export function NavBack_BTN({
  extra_ACTION = () => {},
}: {
  extra_ACTION?: () => void;
}) {
  const router = useRouter();
  return (
    <Btn
      onPress={() => {
        router.back();
        extra_ACTION();
      }}
      iconLeft={<ICON_arrow direction="left" />}
      style={{ flex: 1 }}
    />
  );
}
