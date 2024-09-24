//
//
//

import Btn from "@/src/components/Basic/Btn/Btn";
import Header from "@/src/components/Compound/Header/Header";
import { ICON_arrow, ICON_3dots } from "@/src/components/Basic/icons/icons";
import Page_WRAP from "@/src/components/Compound/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";

export default function Privacy_PAGE() {
  const router = useRouter();

  return (
    <Page_WRAP>
      <Header
        title="Privacy policy"
        btnLeft={
          <Btn
            type="seethrough"
            iconLeft={<ICON_arrow />}
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
    </Page_WRAP>
  );
}
