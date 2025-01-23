//
//
//

import { useRouter } from "expo-router";

type page =
  | "my-vocabs-main"
  | "my-lists"
  | "saved-vocabs"
  | "all-my-vocabs"
  | "deleted-vocabs"
  | "back";

export function USE_routerPush() {
  const router = useRouter();

  const PUSH_router = (target: page) => {
    switch (target) {
      case "my-vocabs-main":
        router.push("/(main)/vocabs");
        break;
      case "my-lists":
        router.push("/(main)/vocabs/lists");
        break;
      case "saved-vocabs":
        router.push("/(main)/vocabs/marked_vocabs");
        break;
      case "all-my-vocabs":
        router.push("/(main)/vocabs/all_vocabs");
        break;
      case "deleted-vocabs":
        router.push("/(main)/vocabs/deleted_vocabs");
        break;
      case "back":
        router.back();
        break;

      default:
        router.push("/(main)/vocabs");
    }
  };

  return { PUSH_router };
}
