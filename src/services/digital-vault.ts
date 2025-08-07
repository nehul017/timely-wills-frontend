import axiosInstance from '@/axios-settings';
import {
  FileWithTitle,
  GeneratedFile,
  UploadedFile,
} from '@/store/digital/types';

interface FileData {
  title: string;
  notes?: string;
  type: string;
}

interface FilesData {
  data: {
    generated: GeneratedFile[];
    downloaded: FileWithTitle[];
  };
}

interface RenameFileData {
  fileId: number;
  title: string;
  notes?: string;
  type: string;
}

interface UpdatedFileResponse {
  data: {
    id: number;
    attributes: {
      title: string;
      notes: string;
      type: 'personal' | 'estate';
      createdAt: string;
      updatedAt: string;
    };
  };
}

class DigitalAPI {
  async uploadFile(formData: globalThis.FormData, fileData: FileData) {
    try {
      const response1 = await axiosInstance.post<UploadedFile[]>(
        '/upload',
        formData,
      );

      const body = {
        data: {
          title: fileData.title,
          notes: fileData.notes || '',
          type: fileData.type,
          file: response1.data[0].id,
        },
      };

      await axiosInstance.post('/digital-vaults', body);
    } catch (error) {
      throw error;
    }
  }

  async getFiles() {
    try {
      const response = await axiosInstance.get<FilesData>(
        '/digital-vaults/my-vault',
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async renameFile(data: RenameFileData) {
    const { fileId, title, type, notes } = data;

    try {
      const response = await axiosInstance.put<UpdatedFileResponse>(
        `/digital-vaults/${fileId}`,
        { data: { fileId, title, type, notes } },
      );

      return {
        id: response.data.data.id,
        updatedDoc: {
          title: response.data.data.attributes.title,
          notes: response.data.data.attributes.notes,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteFile(file: FileWithTitle) {
    try {
      await Promise.all([
        axiosInstance.delete(`/digital-vaults/${file.id}`),
        axiosInstance.delete(`/upload/files/${file.file.id}`),
      ]);
    } catch (error) {
      throw error;
    }
  }
}

const digitalAPI = new DigitalAPI();

export default digitalAPI;
