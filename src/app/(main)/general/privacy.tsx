//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import {
  ICON_arrow2,
  ICON_3dots,
} from "@/src/components/1_grouped/icons/icons";
import Page_WRAP from "@/src/components/1_grouped/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";

export default function Privacy_PAGE() {
  const router = useRouter();

  return (
    <>
      <Header
        title="Privacy policy"
        btnLeft={
          <Btn
            type="seethrough"
            iconLeft={<ICON_arrow2 />}
            onPress={() => router.back()}
            style={{ borderRadius: 100 }}
          />
        }
        btnRight={
          <Btn
            type="seethrough"
            iconLeft={<ICON_3dots />}
            onPress={() => {}}
            style={{ opacity: 0, pointerEvents: "none" }}
          />
        }
      />
    </>
  );
}
