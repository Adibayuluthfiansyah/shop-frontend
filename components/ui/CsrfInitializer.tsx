"use client";

import { useEffect } from "react";
import { useCsrfStore } from "@/app/store/useCsrfStore";
import api from "@/lib/axios";

export default function CsrfInitializer() {
  const setCsrfToken = useCsrfStore((state) => state.setCsrfToken);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await api.get("/csrf-token");
        setCsrfToken(res.data.csrfToken);
        console.log("CSRF TOKEN SECURED");
      } catch (err) {
        console.error("Failed to fetch CSRF token", err);
      }
    };
    fetchCsrfToken();
  }, [setCsrfToken]);
  return null;
}
