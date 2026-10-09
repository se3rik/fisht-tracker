const BASE_API = import.meta.env.VITE_API_URL;

export const getAttachmentUrl = (id: string) => `${BASE_API}/attachments/${id}`;
