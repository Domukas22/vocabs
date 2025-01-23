//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import { ICON_arrow } from "@/src/components/1_grouped/icons/icons";
import { useRouter } from "expo-router";

export function PublicVocabs_HEADER() {
  const router = useRouter();
  return (
    <Header
      btnLeft={
        <Btn
          type="seethrough"
          iconLeft={<ICON_arrow direction="left" />}
          style={{ borderRadius: 100 }}
          onPress={() => router.back()}
        />
      }
      btnRight={
        <Btn
          iconLeft={<ICON_arrow direction="left" />}
          style={{ opacity: 0, pointerEvents: "none" }}
        />
      }
      title="🔤 All public vocabs"
    />
  );
}
