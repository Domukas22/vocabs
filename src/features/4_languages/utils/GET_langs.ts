//
//
//

import { Language_MODEL } from "@/src/db/watermelon_MODELS";

export default function GET_langs({
  languages,
  target = ["en", "de"],
}: {
  languages: Language_MODEL[];
  target: string[];
}) {
  return languages?.filter((lang) => target.includes(lang.id));
}
