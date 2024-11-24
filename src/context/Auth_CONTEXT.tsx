import { createContext, useState, ReactNode, useContext } from "react";
import { supabase } from "../lib/supabase";
import User_MODEL from "@/src/db/models/User_MODEL";

// Define the shape of the Auth context
interface AuthContextType {
  user: User_MODEL | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ userData: User_MODEL | null; error: string | null }>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ userData: any; error: string | null }>;
  logout: () => Promise<{ error: string | null }>;
}

// Create the Auth context with a default value
const Auth_CONTEXT = createContext<AuthContextType | null>(null);

export const Auth_PROVIDER = ({ children }: { children: ReactNode }) => {
  const [user, SET_user] = useState<User_MODEL | null>(null);

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        return { userData: null, error: error.message };
      }

      return { userData: data, error: null }; // You can return the user data if needed
    } catch (err) {
      return {
        userData: null,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { userData: null, error: error.message };
      }

      SET_user(data.user); // Update the user state
      return { userData: data.user, error: null };
    } catch (err) {
      return {
        userData: null,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: error.message };
      }

      SET_user(null); // Clear the user state
      return { error: null }; // Indicate successful logout
    } catch (err) {
      return { error: "An unexpected error occurred. Please try again." };
    }
  };

  return (
    <Auth_CONTEXT.Provider value={{ user, login, register, logout }}>
      {children}
    </Auth_CONTEXT.Provider>
  );
};

export const USE_auth = () => {
  const context = useContext(Auth_CONTEXT);
  if (!context) {
    throw new Error("USE_auth must be used within an Auth_PROVIDER");
  }
  return context;
};
