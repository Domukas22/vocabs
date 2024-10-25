//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import { ICON_arrow, ICON_download } from "@/src/components/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";

export default function OneSharedList_HEADER({
  list_NAME,
  ARE_vocabsFetching,
}: {
  list_NAME: string | undefined;
  ARE_vocabsFetching: boolean;
}) {
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
          type="seethrough"
          iconLeft={
            ARE_vocabsFetching ? (
              <ActivityIndicator color={MyColors.icon_gray} />
            ) : (
              <ICON_download />
            )
          }
          style={{ borderRadius: 100 }}
        />
      }
      title={list_NAME || "..."}
    />
  );
}
