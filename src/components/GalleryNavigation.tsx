import { Button } from "@/components/ui/button";
import { FolderOpen, Grid3x3, Plus } from "lucide-react";
import { GalleryFolder, FilterType } from "@/types/gallery";

interface GalleryNavigationProps {
  folders: GalleryFolder[];
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  totalImages: number;
  onUploadClick: () => void;
}

export function GalleryNavigation({
  folders,
  activeFilter,
  onFilterChange,
  totalImages,
  onUploadClick
}: GalleryNavigationProps) {
  return (
    <nav className="gallery-nav fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-2 mr-8">
            <Grid3x3 className="h-6 w-6 text-gallery-accent" />
            <h1 className="text-xl font-bold text-gradient">Gallery</h1>
          </div>
          
          <Button
            variant={activeFilter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFilterChange('all')}
            className="text-sm"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            All Photos ({totalImages})
          </Button>
          
          {folders.map((folder) => (
            <Button
              key={folder.id}
              variant={activeFilter === folder.name ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onFilterChange(folder.name)}
              className="text-sm"
            >
              {folder.name} ({folder.count})
            </Button>
          ))}
        </div>
        
        <Button 
          onClick={onUploadClick}
          variant="default"
          size="sm"
          className="shadow-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
      </div>
    </nav>
  );
}