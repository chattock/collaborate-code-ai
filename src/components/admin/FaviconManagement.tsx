import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { loadAndSetFavicon, updateFaviconInDocument, cacheFaviconUrl } from "@/utils/faviconLoader";

const FaviconManagement = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [currentFavicon, setCurrentFavicon] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAndSetFavicon().then(url => {
      if (url) setCurrentFavicon(url);
    });
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ description: 'Please select an image file (PNG, JPG, ICO, SVG).', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    try {
      // Remove the old favicon first — one favicon at a time.
      const { data: existingFiles } = await supabase.storage
        .from('project-files')
        .list('favicon/');
      const oldNames = (existingFiles ?? []).filter(f => f.id !== null).map(f => `favicon/${f.name}`);
      if (oldNames.length > 0) {
        await supabase.storage.from('project-files').remove(oldNames);
      }

      const fileExtension = file.name.split('.').pop() || 'png';
      const { data, error } = await supabase.storage
        .from('project-files')
        .upload(`favicon/favicon.${fileExtension}`, file, {
          upsert: true,
          contentType: file.type,
        });
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(data.path);

      const bustedUrl = `${publicUrl}?t=${Date.now()}`;
      setCurrentFavicon(bustedUrl);
      updateFaviconInDocument(bustedUrl);
      cacheFaviconUrl(bustedUrl);

      toast({ description: 'Favicon updated.' });
    } catch (error) {
      console.error('Error uploading favicon:', error);
      toast({ description: 'Failed to upload favicon.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Site Settings</h2>
        <p className="text-sm text-muted-foreground">Appearance settings for the site itself.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="w-4 h-4 text-primary" />
            Favicon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentFavicon && (
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <img
                src={currentFavicon}
                alt="Current favicon"
                className="w-8 h-8"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span className="text-sm">Current favicon</span>
            </div>
          )}

          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
            variant="outline"
          >
            {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {isUploading ? 'Uploading…' : 'Choose Favicon File'}
          </Button>

          <p className="text-xs text-muted-foreground">
            PNG, JPG, ICO or SVG — ideally square, 32×32 or larger. Updates go live immediately.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaviconManagement;
