import { useEffect, useState } from "react";
import User_MODEL from "@/src/db/models/User_MODEL";

export const USE_totalUserVocabs = (user: User_MODEL | undefined) => {
  const [totalVocabs, setTotalVocabs] = useState<number | null>(null);

  useEffect(() => {
    if (!(user instanceof User_MODEL)) return;

    const subscription = user.totalVocab_COUNT.subscribe(setTotalVocabs);

    return () => subscription.unsubscribe();
  }, [user]);

  return totalVocabs;
};
