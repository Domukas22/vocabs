//
//
//

import { ToastProvider } from "react-native-toast-notifications";
import Notification_BLOCK from "../components/1_grouped/blocks/Notification_BLOCK/Notification_BLOCK";

export default function Toast_CONTEXT({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider
      renderType={{
        // Define a render function for each toast type
        success: (toast: any) => (
          <Notification_BLOCK type="success" text={toast.message} />
        ),
        error: (toast: any) => (
          <Notification_BLOCK type="error" text={toast.message} />
        ),
        warning: (toast: any) => (
          <Notification_BLOCK type="warning" text={toast.message} />
        ),
        // Add more toast types as needed
      }}
      style={{
        zIndex: 9999,
        elevation: 9999,
      }}
      offsetBottom={120}
    >
      {children}
    </ToastProvider>
  );
}
