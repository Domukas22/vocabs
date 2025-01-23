//
//
//
import List_MODEL from "@/src/db/models/List_MODEL";
import { USE_zustand } from "@/src/hooks";
import { useState, useEffect } from "react";

type ProfileObservables = {
  totalUserList_COUNT: number | undefined;
  totalUserVocab_COUNT: number | undefined;
  totalSavedVocab_COUNT: number | undefined;
  deletedUserVocab_COUNT: number | undefined;
  myTopLists: List_MODEL[] | undefined;
};

const initialObservables: ProfileObservables = {
  totalUserList_COUNT: 0,
  totalUserVocab_COUNT: 0,
  totalSavedVocab_COUNT: 0,
  deletedUserVocab_COUNT: 0,
  myTopLists: [],
};

export const USE_myProfileObservables = (): ProfileObservables => {
  const [observables, setObservables] =
    useState<ProfileObservables>(initialObservables);
  const { z_user } = USE_zustand();

  useEffect(() => {
    if (!z_user) return;

    const subscriptions = [
      z_user.totalList_COUNT?.subscribe({
        next: (count) =>
          setObservables((obs) => ({
            ...obs,
            totalUserList_COUNT: Number.isFinite(count) ? count : 0,
          })),
        error: (error) =>
          console.error("Error in totalList_COUNT subscription:", error),
      }),
      z_user.totalVocab_COUNT?.subscribe({
        next: (count) =>
          setObservables((obs) => ({
            ...obs,
            totalUserVocab_COUNT: Number.isFinite(count) ? count : 0,
          })),
        error: (error) =>
          console.error("Error in totalVocab_COUNT subscription:", error),
      }),
      z_user.totalSavedVocab_COUNT?.subscribe({
        next: (count) =>
          setObservables((obs) => ({
            ...obs,
            totalSavedVocab_COUNT: Number.isFinite(count) ? count : 0,
          })),
        error: (error) =>
          console.error("Error in totalSavedVocab_COUNT subscription:", error),
      }),
      z_user.deletedVocab_COUNT?.subscribe({
        next: (count) =>
          setObservables((obs) => ({
            ...obs,
            deletedUserVocab_COUNT: Number.isFinite(count) ? count : 0,
          })),
        error: (error) =>
          console.error("Error in deletedVocab_COUNT subscription:", error),
      }),
      z_user.myTopLists?.subscribe({
        next: (lists) =>
          setObservables((obs) => ({
            ...obs,
            myTopLists: (lists as List_MODEL[]) || [], // Default to empty array if undefined
          })),
        error: (error) =>
          console.error("Error in myTopLists subscription:", error),
      }),
    ].filter(Boolean); // Remove undefined subscriptions

    return () => subscriptions.forEach((sub) => sub?.unsubscribe());
  }, [z_user]);

  return observables;
};
