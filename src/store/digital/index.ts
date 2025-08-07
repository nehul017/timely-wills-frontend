import { create } from 'zustand';

import { DigitalState, FileWithTitle, GeneratedFile } from './types';

export const useDigitalStore = create<DigitalState>((set) => ({
  signedCopyDocuments: [],
  estateDocuments: [],
  personalDocuments: [],
  selectedDocument: null,
  documentUrl: '',
  setDocumentUrl: (url: string) => set({ documentUrl: url }),
  setpersonalDocuments: (data: FileWithTitle[]) =>
    set({
      personalDocuments: data
        .filter((file) => file.type === 'personal')
        .map((file) => ({ ...file, isSignedCopy: false })),
    }),
  setSignedCopyDocuments: (data: FileWithTitle[]) =>
    set({
      signedCopyDocuments: data
        .filter((file) => file.type === 'estate')
        .map((file) => ({ ...file, isSignedCopy: true })),
    }),
  setEstateDocuments: (data: GeneratedFile[]) => set({ estateDocuments: data }),
  setSelectedDocument: (file: GeneratedFile | FileWithTitle) =>
    set({ selectedDocument: file }),
}));
