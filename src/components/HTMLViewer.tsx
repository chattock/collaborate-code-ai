import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HTMLViewerProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const HTMLViewer = ({ isOpen, onClose, url, title }: HTMLViewerProps) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && url) {
      setLoading(true);
      fetch(url)
        .then(response => response.text())
        .then(html => {
          setHtmlContent(html);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading HTML:', error);
          setLoading(false);
        });
    }
  }, [isOpen, url]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          ) : (
            <iframe
              srcDoc={htmlContent}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title={title}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HTMLViewer;