export interface GalleryImage {
  id: string;
  url: string;
  name: string;
  folder: string;
  uploadDate: Date;
  file?: File;
}

export interface GalleryFolder {
  id: string;
  name: string;
  count: number;
}

export type FilterType = 'all' | string;