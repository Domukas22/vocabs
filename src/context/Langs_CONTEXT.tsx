//
//
//
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/src/lib/supabase";

interface Language {
  id: string; // Adjust according to your schema
  name: string; // Adjust according to your schema
  // Add other language properties as needed
}

interface LanguageContextType {
  languages: Language[];
  ARE_languagesLoading: boolean;
  languages_ERROR: string | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LangsProviderProps {
  children: ReactNode;
}

export const Langs_PROVIDER: React.FC<LangsProviderProps> = ({ children }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [ARE_languagesLoading, SET_areLanguagesLoading] =
    useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      SET_areLanguagesLoading(true);
      try {
        const { data, error } = await supabase.from("languages").select("*");
        if (error) {
          throw error;
        }
        setLanguages(data);
      } catch (error) {
        console.error("Error fetching languages:", error);
        setError((error as any).message); // Cast to any for TypeScript
      } finally {
        SET_areLanguagesLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const value: LanguageContextType = {
    languages,
    ARE_languagesLoading,
    languages_ERROR: error,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const USE_langs = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("USE_langs must be used within a Langs_PROVIDER");
  }
  return context;
};