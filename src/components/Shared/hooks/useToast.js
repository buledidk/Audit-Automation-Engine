import { useState, useCallback } from "react";

export default function useToast(duration = 3000) {
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), duration);
  }, [duration]);

  const dismissToast = useCallback(() => setToastMsg(null), []);

  return { toastMsg, showToast, dismissToast };
}
