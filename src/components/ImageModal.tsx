import { X } from "lucide-react";
import { GalleryImage } from "@/types/gallery";
import { Button } from "@/components/ui/button";

interface ImageModalProps {
  image: GalleryImage;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ image, isOpen, onClose }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-[90vw] max-h-[90vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <img
          src={image.url}
          alt={image.name}
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 rounded-b-xl">
          <h3 className="text-white font-semibold text-lg mb-1">{image.name}</h3>
          <p className="text-white/70 text-sm">{image.folder}</p>
        </div>
      </div>
    </div>
  );
}