eas build --profile development --platform ios

/mnt/c/Users/domas/AppData/Local/Android/Sdk/emulator/emulator.exe -avd Pixel_8_API_35

🔴
🟢

# ChatGPT testing explanation

Test this code for me. Please make sure to use the "renderHook" from @testing-library/react-native. Do not use anything from "@testing-library/react-hooks", instead use everything from "@testing-library/react-native", including "act", "waitFor" and so on. Do not use renderook it the test case doesn't require it. Each test name does not start with "should...", but rather numerated, following with a verb, for example: "1. Hides varaibles...", "2. Throws and error when...", "3. Handles undefined gracefully...".

Make sure to cover all critical edge cases, including incorrect / undefined values returned, as well as other weird bugs you can think of.
