//
//
//

import { ToastProvider } from "react-native-toast-notifications";
import Notification_BOX from "../Notification_BOX/Notification_BOX";

export default function My_TOAST({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider
      renderType={{
        green: (toast) => (
          <Notification_BOX type="success" text={toast?.message} />
        ),
        red: (toast) => <Notification_BOX type="error" text={toast?.message} />,
        custom_warning: (toast) => (
          <Notification_BOX type="warning" text={toast?.message} />
        ),
      }}
      style={{
        bottom: 400,
        zIndex: 9999, // Ensure it's a high value to stay on top
        elevation: 9999, // For Android devices
      }}
    >
      {children}
    </ToastProvider>
  );
}
