import { useEffect, useState } from 'react';
import { Upload, FileText, X, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCv, invalidateCvCache } from '@/hooks/useCv';

const deleteFolder = async (folder: string) => {
  const { data: files } = await supabase.storage.from('project-files').list(folder);
  const names = (files ?? []).filter(f => f.id !== null).map(f => `${folder}/${f.name}`);
  if (names.length > 0) {
    await supabase.storage.from('project-files').remove(names);
  }
};

const CVManagement = () => {
  const { cvUrl, cvOriginalUrl, isLoading, hasLoaded, load } = useCv();
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Replace whatever is there — one CV at a time.
      await Promise.all([deleteFolder('cv'), deleteFolder('cv/previews')]);

      // documentConverter pulls in pdf.js, so it stays out of the main bundle.
      const { uploadCVWithImage } = await import('@/utils/documentConverter');
      await uploadCVWithImage(file);

      invalidateCvCache();
      await load(true);
      toast({ description: 'CV uploaded and live.' });
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast({ description: 'Failed to upload CV. Please try again.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await Promise.all([deleteFolder('cv'), deleteFolder('cv/previews')]);
      invalidateCvCache();
      await load(true);
      toast({ description: 'CV removed.' });
    } catch (error) {
      console.error('Error removing CV:', error);
      toast({ description: 'Failed to remove CV.', variant: 'destructive' });
    } finally {
      setIsRemoving(false);
    }
  };

  const handleDownload = () => {
    const url = cvOriginalUrl || cvUrl;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CV';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
    disabled: isUploading,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) handleUpload(acceptedFiles[0]);
    },
  });

  const busy = isUploading || isRemoving;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">CV</h2>
        <p className="text-sm text-muted-foreground">Shown in the “CV” dialog on the homepage. Uploads go live immediately.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="w-4 h-4 text-primary" />
            Current CV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasLoaded || isLoading ? (
            <Skeleton className="h-40 rounded-lg" />
          ) : cvUrl ? (
            <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">CV Document</p>
                    <p className="text-sm text-muted-foreground">Preview below — visitors see this and can download the original.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownload} disabled={busy}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRemove} disabled={busy}>
                    {isRemoving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
                    Remove
                  </Button>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden bg-white">
                <img src={cvUrl} alt="CV Preview" className="w-full h-auto max-h-96 object-contain" />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No CV uploaded yet.</p>
          )}

          <div
            {...getRootProps()}
            className={`border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors ${
              isUploading ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:border-primary'
            }`}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            )}
            <p className="font-medium mb-1">{isUploading ? 'Uploading…' : cvUrl ? 'Replace CV' : 'Upload your CV'}</p>
            <p className="text-sm text-muted-foreground">
              Drop a file here or click to select — PDF, DOC or DOCX. PDFs get an automatic preview image.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVManagement;
