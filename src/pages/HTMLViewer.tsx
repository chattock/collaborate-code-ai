import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HTMLViewer = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url') || '';
  const title = searchParams.get('title') || 'HTML Document';
  
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!url) {
      setError('No URL provided');
      setLoading(false);
      return;
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load document: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        setHtmlContent(html);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading HTML:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [url]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading document...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-4">Error Loading Document</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portfolio
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="font-semibold text-foreground truncate">{title}</h1>
          </div>
        </div>
      </div>
      
      <div className="w-full">
        <iframe
          srcDoc={htmlContent}
          className="w-full min-h-[calc(100vh-4rem)] border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          title={title}
        />
      </div>
    </div>
  );
};

export default HTMLViewer;