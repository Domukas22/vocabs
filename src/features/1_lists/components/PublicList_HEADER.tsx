//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import { ICON_arrow, ICON_download } from "@/src/components/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";

export default function PublicList_HEADER({
  list_NAME,
  IS_listFetching,
  TOGGLE_saveListModal = () => {},
}: {
  list_NAME: string | undefined;
  IS_listFetching: boolean;
  TOGGLE_saveListModal: () => void;
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
            IS_listFetching ? (
              <ActivityIndicator color={MyColors.icon_gray} />
            ) : (
              <ICON_download />
            )
          }
          onPress={TOGGLE_saveListModal}
          style={{ borderRadius: 100 }}
        />
      }
      title={list_NAME || "..."}
    />
  );
}
