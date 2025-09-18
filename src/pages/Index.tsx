import { useState, useMemo } from "react";
import { GalleryNavigation } from "@/components/GalleryNavigation";
import { GalleryGrid } from "@/components/GalleryGrid";
import { ImageUpload } from "@/components/ImageUpload";
import { GalleryImage, GalleryFolder, FilterType } from "@/types/gallery";

const Index = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Generate folders based on images
  const folders: GalleryFolder[] = useMemo(() => {
    const folderMap = new Map<string, number>();
    
    images.forEach(image => {
      folderMap.set(image.folder, (folderMap.get(image.folder) || 0) + 1);
    });
    
    return Array.from(folderMap.entries()).map(([name, count]) => ({
      id: `folder-${name}`,
      name,
      count
    }));
  }, [images]);

  // Filter images based on active filter
  const filteredImages = useMemo(() => {
    if (activeFilter === 'all') return images;
    return images.filter(image => image.folder === activeFilter);
  }, [images, activeFilter]);

  const handleUpload = async (newImages: GalleryImage[]) => {
    setLoading(true);
    
    // Simulate upload delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setImages(prev => [...prev, ...newImages]);
    setLoading(false);
    
    // Switch to the uploaded folder if it's not "general"
    const uploadFolder = newImages[0]?.folder;
    if (uploadFolder && uploadFolder !== 'general') {
      setActiveFilter(uploadFolder);
    }
  };

  return (
    <div className="gallery-container min-h-screen">
      <GalleryNavigation
        folders={folders}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        totalImages={images.length}
        onUploadClick={() => setIsUploadOpen(true)}
      />
      
      <GalleryGrid 
        images={filteredImages}
        loading={loading}
      />
      
      <ImageUpload
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
        folders={folders}
      />
    </div>
  );
};

export default Index;