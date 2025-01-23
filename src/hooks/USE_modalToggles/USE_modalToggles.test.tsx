//
//
//

import { renderHook, act } from "@testing-library/react-native";
import { USE_modalToggles } from "./USE_modalToggles"; // Adjust the path as needed

describe("USE_modalToggles", () => {
  it("1. Initialize all modals with default state (IS_open = false)", () => {
    const modalNames = ["modalA", "modalB", "modalC"];
    const { result } = renderHook(() => USE_modalToggles(modalNames));

    modalNames.forEach((name) => {
      expect(result.current.modals[name].IS_open).toBe(false); // All modals should start closed
    });
  });

  it("2. Toggle a modal's state from false to true and back to false", () => {
    const modalNames = ["modalA"];
    const { result } = renderHook(() => USE_modalToggles(modalNames));

    act(() => {
      result.current.modals.modalA.toggle();
    });
    expect(result.current.modals.modalA.IS_open).toBe(true); // Toggle to true

    act(() => {
      result.current.modals.modalA.toggle();
    });
    expect(result.current.modals.modalA.IS_open).toBe(false); // Toggle back to false
  });

  it("3. Set modal state to true directly", () => {
    const modalNames = ["modalB"];
    const { result } = renderHook(() => USE_modalToggles(modalNames));

    act(() => {
      result.current.modals.modalB.set(true);
    });
    expect(result.current.modals.modalB.IS_open).toBe(true); // Manually set to true
  });

  it("4. Set modal state to false directly", () => {
    const modalNames = ["modalC"];
    const { result } = renderHook(() => USE_modalToggles(modalNames));

    act(() => {
      result.current.modals.modalC.set(false);
    });
    expect(result.current.modals.modalC.IS_open).toBe(false); // Manually set to false
  });
});
