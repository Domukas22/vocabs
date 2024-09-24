//
//
//

import { Language_MODEL } from "@/src/db/models";

export default function GET_defaultLangs({
  languages,
  starter = ["en", "de"],
}: {
  languages: Language_MODEL[];
  starter: string[];
}) {
  return languages?.filter((lang) => starter.includes(lang.id));
}
