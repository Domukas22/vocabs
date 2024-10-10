//
//
//

import { Language_PROPS } from "@/src/db/props";

export default function GET_langs({
  languages,
  target = ["en", "de"],
}: {
  languages: Language_PROPS[];
  target: string[];
}) {
  return languages?.filter((lang) => target.includes(lang.id));
}
