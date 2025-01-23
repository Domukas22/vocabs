//
//
//

import { renderHook, act } from "@testing-library/react-native";
import { BehaviorSubject } from "rxjs";
import { USE_myProfileObservables } from "./USE_myProfileObservables"; // Adjust path as needed
import { USE_zustand } from "@/src/hooks";

jest.mock("@/src/zustand", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Explicit type casting with coercion to avoid TypeScript errors
const mockUseZustand = USE_zustand as unknown as jest.Mock;

describe("USE_myProfileObservables", () => {
  let mockZUser: any;
  let totalListCount$: BehaviorSubject<number>;
  let totalVocabCount$: BehaviorSubject<number>;
  let savedVocabCount$: BehaviorSubject<number>;
  let deletedVocabCount$: BehaviorSubject<number>;
  let myTopLists$: BehaviorSubject<any[]>;

  beforeEach(() => {
    totalListCount$ = new BehaviorSubject<number>(0);
    totalVocabCount$ = new BehaviorSubject<number>(0);
    savedVocabCount$ = new BehaviorSubject<number>(0);
    deletedVocabCount$ = new BehaviorSubject<number>(0);
    myTopLists$ = new BehaviorSubject<any[]>([]);

    mockUseZustand.mockReturnValue({
      z_user: {
        totalList_COUNT: totalListCount$,
        totalVocab_COUNT: totalVocabCount$,
        totalSavedVocab_COUNT: savedVocabCount$,
        deletedVocab_COUNT: deletedVocabCount$,
        myTopLists: myTopLists$,
      },
    });
  });

  it("1. Initialize with default values", () => {
    const { result } = renderHook(() => USE_myProfileObservables());

    expect(result.current.totalUserList_COUNT).toBe(0);
    expect(result.current.totalUserVocab_COUNT).toBe(0);
    expect(result.current.totalSavedVocab_COUNT).toBe(0);
    expect(result.current.deletedUserVocab_COUNT).toBe(0);
    expect(result.current.myTopLists).toEqual([]);
  });

  it("2. Update values when observables emit new data", () => {
    const { result } = renderHook(() => USE_myProfileObservables());

    act(() => {
      totalListCount$.next(5);
      totalVocabCount$.next(10);
      savedVocabCount$.next(3);
      deletedVocabCount$.next(1);
      myTopLists$.next([{ id: 1, name: "Test List" }]);
    });

    expect(result.current.totalUserList_COUNT).toBe(5);
    expect(result.current.totalUserVocab_COUNT).toBe(10);
    expect(result.current.totalSavedVocab_COUNT).toBe(3);
    expect(result.current.deletedUserVocab_COUNT).toBe(1);
    expect(result.current.myTopLists).toEqual([{ id: 1, name: "Test List" }]);
  });

  it("3. Handle multiple updates to the observables", () => {
    const { result } = renderHook(() => USE_myProfileObservables());

    act(() => {
      totalListCount$.next(5);
      totalVocabCount$.next(10);
      savedVocabCount$.next(3);
    });

    expect(result.current.totalUserList_COUNT).toBe(5);
    expect(result.current.totalUserVocab_COUNT).toBe(10);
    expect(result.current.totalSavedVocab_COUNT).toBe(3);

    act(() => {
      totalListCount$.next(6);
      totalVocabCount$.next(11);
      savedVocabCount$.next(4);
      deletedVocabCount$.next(2);
      myTopLists$.next([{ id: 2, name: "Updated List" }]);
    });

    expect(result.current.totalUserList_COUNT).toBe(6);
    expect(result.current.totalUserVocab_COUNT).toBe(11);
    expect(result.current.totalSavedVocab_COUNT).toBe(4);
    expect(result.current.deletedUserVocab_COUNT).toBe(2);
    expect(result.current.myTopLists).toEqual([
      { id: 2, name: "Updated List" },
    ]);
  });

  it("4. Handle undefined initial observable values", () => {
    mockUseZustand.mockReturnValueOnce({
      z_user: {
        totalList_COUNT: undefined,
        totalVocab_COUNT: undefined,
        totalSavedVocab_COUNT: undefined,
        deletedVocab_COUNT: undefined,
        myTopLists: undefined,
      },
    });

    const { result } = renderHook(() => USE_myProfileObservables());

    expect(result.current.totalUserList_COUNT).toBe(0);
    expect(result.current.totalUserVocab_COUNT).toBe(0);
    expect(result.current.totalSavedVocab_COUNT).toBe(0);
    expect(result.current.deletedUserVocab_COUNT).toBe(0);
    expect(result.current.myTopLists).toEqual([]);
  });

  it("5. Handle null values in observables", () => {
    totalListCount$.next(null as any);
    totalVocabCount$.next(null as any);
    savedVocabCount$.next(null as any);
    deletedVocabCount$.next(null as any);
    myTopLists$.next(null as any);

    const { result } = renderHook(() => USE_myProfileObservables());

    expect(result.current.totalUserList_COUNT).toBe(0);
    expect(result.current.totalUserVocab_COUNT).toBe(0);
    expect(result.current.totalSavedVocab_COUNT).toBe(0);
    expect(result.current.deletedUserVocab_COUNT).toBe(0);
    expect(result.current.myTopLists).toEqual([]);
  });

  it("6. Handle NaN values in observables", () => {
    act(() => {
      totalListCount$.next(NaN);
      totalVocabCount$.next(NaN);
      savedVocabCount$.next(NaN);
      deletedVocabCount$.next(NaN);
    });

    const { result } = renderHook(() => USE_myProfileObservables());

    expect(result.current.totalUserList_COUNT).toBe(0);
    expect(result.current.totalUserVocab_COUNT).toBe(0);
    expect(result.current.totalSavedVocab_COUNT).toBe(0);
    expect(result.current.deletedUserVocab_COUNT).toBe(0);
  });
});
