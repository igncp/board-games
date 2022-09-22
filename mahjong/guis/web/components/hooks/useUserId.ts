import { useEffect } from "react";
import { v4 as uuid } from "uuid";

export const useUserId = (setUserId: (userId: string) => void) => {
  useEffect(() => {
    const userId = (() => {
      const persited = sessionStorage.getItem("userId");
      if (persited) return persited;
      const newId = uuid().toString(36).substring(7);
      sessionStorage.setItem("userId", newId);
      return newId;
    })();

    setUserId(userId);
  }, []);
};
