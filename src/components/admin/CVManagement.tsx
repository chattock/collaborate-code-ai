import { useState } from 'react';
import { Upload, FileText, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProject } from '@/contexts/ProjectContext';
import { useDropzone } from 'react-dropzone';

const CVManagement = () => {
  const { cvFile, setCvFile } = useProject();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setCvFile(acceptedFiles[0]);
      }
    }
  });

  const handleRemoveCV = () => {
    setCvFile(null);
  };

  const handleDownloadCV = () => {
    if (cvFile) {
      const url = URL.createObjectURL(cvFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = cvFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          CV Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cvFile ? (
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">{cvFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(cvFile.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadCV}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleRemoveCV}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Upload your CV</p>
            <p className="text-sm text-muted-foreground mb-4">
              Drop your CV file here or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOC, DOCX (Max 10MB)
            </p>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p>• The CV will be available for download in the About section</p>
          <p>• Supported formats: PDF, Word documents</p>
          <p>• Maximum file size: 10MB</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVManagement;