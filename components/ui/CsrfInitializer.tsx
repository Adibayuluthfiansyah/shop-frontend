"use client";

import { useEffect, useRef } from "react";
import { useCsrfStore } from "@/app/store/useCsrfStore";
import api from "@/lib/axios";

export default function CsrfInitializer() {
  const setCsrfToken = useCsrfStore((state) => state.setCsrfToken);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      const fetchCsrfToken = async () => {
        try {
          const res = await api.get("/auth/csrf-token");
          setCsrfToken(res.data.csrfToken);
          initialized.current = true;
        } catch (error) {
          console.error("Failed to fetch CSRF token", error);
        }
      };
      fetchCsrfToken();
    }
  }, [setCsrfToken]);
  return null;
}
