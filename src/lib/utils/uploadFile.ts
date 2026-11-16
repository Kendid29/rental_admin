import fetchHelper from '@/services/fetchHelper';

const uploadFile = async (file: File) => {
  const formData = new FormData();

  formData.append('file', file);

  const response = await fetchHelper('/file-system', 'POST', formData);

  return response.data.uuid;
};

export default uploadFile;
