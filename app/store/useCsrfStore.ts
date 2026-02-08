import {create } from 'zustand';

interface CsrfState {
    csrfToken: string | null;
    setCsrfToken: (token : string) => void;
}

export const useCsrfStore = create<CsrfState>((set) => ({
    csrfToken: null,
    setCsrfToken: (token: string) => set ({csrfToken: token})
}))