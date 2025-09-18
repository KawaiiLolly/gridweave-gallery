export interface GalleryImage {
  id: string;
  name: string;
  url: string;
  folder: string;
  uploadDate: Date;
  isFavorite?: boolean;
}

export interface GalleryFolder {
  id: string;
  name: string;
  count: number;
}

export type FilterType = 'all' | 'favorites' | string;