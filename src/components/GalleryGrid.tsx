import { useState } from "react";
import { Heart, Download, Eye } from "lucide-react";
import { GalleryImage } from "@/types/gallery";
import { Button } from "@/components/ui/button";

interface GalleryGridProps {
  images: GalleryImage[];
  loading?: boolean;
}

export function GalleryGrid({ images, loading }: GalleryGridProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (imageId: string) => {
    setImageErrors(prev => new Set(prev).add(imageId));
  };

  if (loading) {
    return (
      <div className="masonry-grid pt-24 px-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="masonry-item animate-pulse">
            <div className="gallery-card rounded-xl p-0 overflow-hidden">
              <div className="bg-gallery-surface-elevated aspect-[3/4] rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="pt-32 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-64 h-48 mx-auto mb-8 rounded-xl bg-gallery-card flex items-center justify-center">
            <img 
              src="/src/assets/gallery-empty-state.jpg" 
              alt="Empty gallery" 
              className="w-full h-full object-cover rounded-xl opacity-50"
            />
          </div>
          <h2 className="text-2xl font-semibold text-gallery-text mb-2">
            No images yet
          </h2>
          <p className="text-gallery-text-muted">
            Upload your first images to get started with your gallery
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="masonry-grid pt-24 px-6 pb-8">
      {images.map((image, index) => (
        <div 
          key={image.id} 
          className="masonry-item animate-scale-in group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="gallery-card rounded-xl p-0 overflow-hidden relative">
            {!imageErrors.has(image.id) ? (
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-auto block transition-transform duration-300 group-hover:scale-105"
                onError={() => handleImageError(image.id)}
                loading="lazy"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-gallery-surface-elevated flex items-center justify-center rounded-xl">
                <p className="text-gallery-text-muted text-sm">Failed to load</p>
              </div>
            )}
            
            {/* Image overlay with actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <Button size="sm" variant="secondary" className="shadow-lg">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary" className="shadow-lg">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary" className="shadow-lg">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white font-medium text-sm truncate">{image.name}</p>
              <p className="text-white/70 text-xs">{image.folder}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}