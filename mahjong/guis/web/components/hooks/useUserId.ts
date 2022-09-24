import { useEffect } from "react";
import { v4 as uuid } from "uuid";

const KEY = "userId";

export const useUserId = (setUserId: (userId: string) => void) => {
  useEffect(() => {
    const userId = (() => {
      const persited = sessionStorage.getItem(KEY);
      if (persited) return persited;
      const newId = uuid().toString(36).substring(7);
      sessionStorage.setItem(KEY, newId);
      return newId;
    })();

    setUserId(userId);
  }, []);
};

export const useSetUserId = (userId?: string) => {
  useEffect(() => {
    if (userId) {
      sessionStorage.setItem(KEY, userId);
    }
  }, [userId]);
};
