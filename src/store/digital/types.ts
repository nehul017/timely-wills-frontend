export interface UploadedFile {
  id: number;
  name: string;
  ext: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  mime: string;
}

export interface FileWithTitle {
  id: number;
  title: string;
  notes: string;
  type: 'personal' | 'estate';
  createdAt: string;
  updatedAt: string;
  file: UploadedFile;
  isSignedCopy: boolean;
}

export interface GeneratedFile {
  id: number;
  title: string;
  notes: string;
  createdAt: string;
  isSignedCopy?: boolean;
  type?: 'personal' | 'estate';
  file: {
    mime?: string;
    name: string;
    url: string;
  };
}

export interface DigitalState {
  signedCopyDocuments: FileWithTitle[];
  estateDocuments: GeneratedFile[];
  personalDocuments: FileWithTitle[];
  selectedDocument: GeneratedFile | FileWithTitle | null;
  documentUrl: string;
  setDocumentUrl: (url: string) => void;
  setpersonalDocuments: (files: FileWithTitle[]) => void;
  setSignedCopyDocuments: (files: FileWithTitle[]) => void;
  setEstateDocuments: (files: GeneratedFile[]) => void;
  setSelectedDocument: (file: FileWithTitle | GeneratedFile) => void;
}
