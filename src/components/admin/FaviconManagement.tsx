import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { loadAndSetFavicon } from "@/utils/faviconLoader";

const FaviconManagement = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [currentFavicon, setCurrentFavicon] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load existing favicon on component mount
  useEffect(() => {
    loadCurrentFavicon();
  }, []);

  const loadCurrentFavicon = async () => {
    const faviconUrl = await loadAndSetFavicon();
    if (faviconUrl) {
      setCurrentFavicon(faviconUrl);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file (PNG, JPG, etc.)",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Delete existing favicon if it exists
      const { data: existingFiles } = await supabase.storage
        .from('project-files')
        .list('favicon/');

      if (existingFiles && existingFiles.length > 0) {
        for (const existingFile of existingFiles) {
          await supabase.storage
            .from('project-files')
            .remove([`favicon/${existingFile.name}`]);
        }
      }

      // Upload new favicon
      const fileExtension = file.name.split('.').pop() || 'png';
      const fileName = `favicon.${fileExtension}`;
      const filePath = `favicon/${fileName}`;

      const { data, error } = await supabase.storage
        .from('project-files')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(data.path);

      setCurrentFavicon(publicUrl);

      // Update the favicon in the document
      updateFaviconInDocument(publicUrl);

      toast({
        title: "Success",
        description: "Favicon updated successfully"
      });
    } catch (error) {
      console.error('Error uploading favicon:', error);
      toast({
        title: "Error",
        description: "Failed to upload favicon",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const updateFaviconInDocument = (url: string) => {
    // Remove all existing favicon links
    const existingFavicons = document.querySelectorAll("link[rel*='icon']");
    existingFavicons.forEach(link => link.remove());
    
    // Create new favicon link
    const faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.href = url;
    faviconLink.type = 'image/png';
    document.head.appendChild(faviconLink);
    
    // Force browser to reload favicon by appending timestamp
    const timestamp = new Date().getTime();
    faviconLink.href = `${url}?t=${timestamp}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Favicon Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Upload a new favicon for your portfolio. Recommended size: 32x32 or 16x16 pixels.
        </div>
        
        {currentFavicon && (
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <img 
              src={currentFavicon} 
              alt="Current favicon" 
              className="w-8 h-8"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-sm">Current favicon</span>
          </div>
        )}

        <div className="space-y-2">
          <Label>Upload New Favicon</Label>
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              onClick={handleFileSelect}
              disabled={isUploading}
              className="w-full"
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Choose Favicon File"}
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Supported formats: PNG, JPG, ICO, SVG. The favicon will be automatically updated across your site.
        </div>
      </CardContent>
    </Card>
  );
};

export default FaviconManagement;