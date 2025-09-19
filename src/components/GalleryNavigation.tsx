import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FolderOpen, Grid3x3, Plus, Heart, User, LogOut } from "lucide-react";
import { GalleryFolder, FilterType } from "@/types/gallery";
import { User as SupabaseUser } from '@supabase/supabase-js';

interface GalleryNavigationProps {
  folders: GalleryFolder[];
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  totalImages: number;
  onUploadClick: () => void;
  user: SupabaseUser;
  onSignOut: () => Promise<void>;
}

export function GalleryNavigation({
  folders,
  activeFilter,
  onFilterChange,
  totalImages,
  onUploadClick,
  user,
  onSignOut
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
          
          <Button
            variant={activeFilter === 'favorites' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFilterChange('favorites')}
            className={`text-sm ${
              activeFilter === 'favorites' 
                ? 'bg-gallery-favorite hover:bg-gallery-favorite-hover text-white' 
                : ''
            }`}
          >
            <Heart className={`h-4 w-4 mr-2 ${activeFilter === 'favorites' ? 'fill-current' : ''}`} />
            Favorites
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
        
        <div className="flex items-center space-x-4">
          <Button 
            onClick={onUploadClick}
            variant="default"
            size="sm"
            className="shadow-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Images
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}