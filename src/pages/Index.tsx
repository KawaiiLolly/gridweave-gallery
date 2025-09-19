import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { GalleryNavigation } from "@/components/GalleryNavigation";
import { GalleryGrid } from "@/components/GalleryGrid";
import { ImageUpload } from "@/components/ImageUpload";
import { GalleryImage, GalleryFolder, FilterType } from "@/types/gallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, LogIn } from "lucide-react";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Camera className="h-12 w-12 mx-auto text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Camera className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              GridWeave Gallery
            </CardTitle>
            <CardDescription>
              Please sign in to access your photo gallery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/auth')} 
              className="w-full"
              size="lg"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In / Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
    if (activeFilter === 'favorites') return images.filter(image => image.isFavorite);
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

  const handleToggleFavorite = (imageId: string) => {
    setImages(prev => 
      prev.map(image => 
        image.id === imageId 
          ? { ...image, isFavorite: !image.isFavorite }
          : image
      )
    );
  };

  return (
    <div className="gallery-container min-h-screen">
      <GalleryNavigation
        folders={folders}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        totalImages={images.length}
        onUploadClick={() => setIsUploadOpen(true)}
        user={user}
        onSignOut={signOut}
      />
      
      <GalleryGrid 
        images={filteredImages}
        loading={loading}
        onToggleFavorite={handleToggleFavorite}
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