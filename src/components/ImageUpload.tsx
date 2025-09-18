import { useState, useCallback } from "react";
import { Upload, FolderPlus, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GalleryImage, GalleryFolder } from "@/types/gallery";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (images: GalleryImage[]) => void;
  folders: GalleryFolder[];
}

export function ImageUpload({ isOpen, onClose, onUpload, folders }: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("general");
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    );
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select images to upload",
        variant: "destructive"
      });
      return;
    }

    const targetFolder = isCreatingFolder ? newFolderName : selectedFolder;
    
    if (!targetFolder) {
      toast({
        title: "No folder selected",
        description: "Please select or create a folder",
        variant: "destructive"
      });
      return;
    }

    const newImages: GalleryImage[] = selectedFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: URL.createObjectURL(file),
      name: file.name,
      folder: targetFolder,
      uploadDate: new Date(),
      file
    }));

    onUpload(newImages);
    
    // Reset state
    setSelectedFiles([]);
    setNewFolderName("");
    setIsCreatingFolder(false);
    setSelectedFolder("general");
    
    toast({
      title: "Upload successful",
      description: `${newImages.length} image(s) uploaded to ${targetFolder}`,
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="gallery-card rounded-2xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gallery-text">Upload Images</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Drag and drop area */}
        <div
          className={`upload-zone rounded-xl p-8 text-center mb-6 ${
            dragActive ? 'border-gallery-accent bg-gallery-card-hover' : ''
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-gallery-text-muted mx-auto mb-4" />
          <p className="text-gallery-text mb-2">Drag and drop images here</p>
          <p className="text-gallery-text-muted text-sm mb-4">or click to select files</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="secondary" asChild>
              <span className="cursor-pointer">
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose Files
              </span>
            </Button>
          </label>
        </div>

        {/* Selected files */}
        {selectedFiles.length > 0 && (
          <div className="mb-6">
            <h3 className="text-gallery-text font-medium mb-3">
              Selected Files ({selectedFiles.length})
            </h3>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between gallery-card p-2 rounded-lg">
                  <span className="text-gallery-text text-sm truncate flex-1 mr-2">
                    {file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Folder selection */}
        <div className="mb-6">
          <Label className="text-gallery-text mb-3 block">Upload to folder</Label>
          <div className="flex space-x-2">
            {!isCreatingFolder ? (
              <>
                <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.name}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingFolder(true)}
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
              </>
            ) : (
              <>
                <Input
                  placeholder="New folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName("");
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Upload button */}
        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload} className="shadow-glow">
            Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </div>
  );
}