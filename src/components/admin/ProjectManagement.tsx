import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Upload, X, FileText, Github, Globe, Video, GripVertical, Code, Loader2, Save } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProject, Project, ProjectButton } from '@/contexts/ProjectContext';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { uploadReportFile } from '@/utils/reportUpload';

const BUTTON_TYPES: { value: ProjectButton['type']; label: string; icon: typeof Globe }[] = [
  { value: 'website', label: 'Website', icon: Globe },
  { value: 'github', label: 'Github', icon: Github },
  { value: 'report', label: 'Report', icon: FileText },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'html', label: 'HTML Document', icon: Code },
];

const emptyProject: Omit<Project, 'id'> = {
  title: '',
  titleZh: '',
  introduction: '',
  introductionZh: '',
  image: '',
  buttons: [],
};

interface ProjectFormProps {
  open: boolean;
  initial: Project | null; // null = adding a new project
  onClose: () => void;
  onSubmit: (values: Omit<Project, 'id'>) => void;
}

const ProjectFormDialog = ({ open, initial, onClose, onSubmit }: ProjectFormProps) => {
  const [values, setValues] = useState<Omit<Project, 'id'>>(emptyProject);
  const [uploadingButtonId, setUploadingButtonId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setValues(initial ? { ...initial } : emptyProject);
    }
  }, [open, initial]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setValues(prev => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    },
  });

  const setField = (field: keyof Omit<Project, 'id'>, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const addButton = () => {
    setValues(prev => ({
      ...prev,
      buttons: [...prev.buttons, { id: crypto.randomUUID(), type: 'website', label: '', url: '' }],
    }));
  };

  const removeButton = (buttonId: string) => {
    setValues(prev => ({ ...prev, buttons: prev.buttons.filter(b => b.id !== buttonId) }));
  };

  const updateButton = (buttonId: string, updates: Partial<ProjectButton>) => {
    setValues(prev => ({
      ...prev,
      buttons: prev.buttons.map(b => b.id === buttonId ? { ...b, ...updates } : b),
    }));
  };

  const handleFileUpload = async (buttonId: string, file: File) => {
    setUploadingButtonId(buttonId);
    try {
      const url = await uploadReportFile(file, initial?.id || 'new', buttonId);
      updateButton(buttonId, { url, fileName: file.name });
      toast({ description: `Uploaded ${file.name}` });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({ description: 'File upload failed. Please try again.', variant: 'destructive' });
    } finally {
      setUploadingButtonId(null);
    }
  };

  const handleSubmit = () => {
    if (!values.title.trim()) {
      toast({ description: 'Please add an English title.', variant: 'destructive' });
      return;
    }
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title (English)</Label>
              <Input id="title" value={values.title} onChange={(e) => setField('title', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="titleZh">Title (中文)</Label>
              <Input id="titleZh" value={values.titleZh} onChange={(e) => setField('titleZh', e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="introduction">Introduction (English)</Label>
            <Input id="introduction" value={values.introduction} onChange={(e) => setField('introduction', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="introductionZh">Introduction (中文)</Label>
            <Input id="introductionZh" value={values.introductionZh} onChange={(e) => setField('introductionZh', e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Project Image</Label>
            <div className="flex gap-4 items-start">
              <div {...getRootProps()} className="flex-1 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drop an image here or click to select</p>
              </div>
              {values.image && (
                <img src={values.image} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Buttons</Label>
              <Button type="button" onClick={addButton} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Button
              </Button>
            </div>
            <div className="space-y-2">
              {values.buttons.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">No buttons yet — add links to the project's website, report, or code.</p>
              )}
              {values.buttons.map((button) => {
                const needsFile = button.type === 'report' || button.type === 'html';
                const isUploading = uploadingButtonId === button.id;
                return (
                  <Card key={button.id} className="p-3">
                    <div className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <Select
                            value={button.type}
                            onValueChange={(value) => updateButton(button.id, { type: value as ProjectButton['type'] })}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {BUTTON_TYPES.map(bt => (
                                <SelectItem key={bt.value} value={bt.value}>{bt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Button label (optional)"
                            value={button.label}
                            onChange={(e) => updateButton(button.id, { label: e.target.value })}
                          />
                        </div>
                        {!needsFile && (
                          <Input
                            placeholder="URL"
                            value={button.url || ''}
                            onChange={(e) => updateButton(button.id, { url: e.target.value })}
                          />
                        )}
                        {needsFile && (
                          <div>
                            <input
                              type="file"
                              accept={button.type === 'html' ? '.html,.htm' : '.pdf,.doc,.docx'}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(button.id, file);
                              }}
                              className="hidden"
                              id={`file-${button.id}`}
                            />
                            <label
                              htmlFor={`file-${button.id}`}
                              className="border-2 border-dashed border-border rounded p-2 text-center cursor-pointer hover:border-primary transition-colors block"
                            >
                              {isUploading ? (
                                <Loader2 className="w-4 h-4 mx-auto mb-1 animate-spin text-muted-foreground" />
                              ) : button.type === 'html' ? (
                                <Code className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                              ) : (
                                <FileText className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                              )}
                              <p className="text-xs text-muted-foreground">
                                {isUploading
                                  ? 'Uploading…'
                                  : button.fileName || (button.url ? 'File uploaded — click to replace' :
                                    button.type === 'html' ? 'Upload HTML file' : 'Upload PDF/Word file')}
                              </p>
                            </label>
                            {(button.fileName || button.url) && !isUploading && (
                              <p className="text-xs text-green-600 mt-1">✓ {button.fileName || 'File uploaded'}</p>
                            )}
                          </div>
                        )}
                      </div>
                      <Button type="button" variant="outline" size="icon" aria-label="Remove button" onClick={() => removeButton(button.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>{initial ? 'Apply Changes' : 'Add Project'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProjectManagement = () => {
  const { projects, isLoading, addProject, updateProject, deleteProject, reorderProjects, hasUnsavedChanges, saveChanges } = useProject();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Project | null>(null);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await saveChanges();
      toast({ description: 'Projects saved and live.' });
    } catch (error) {
      console.error('Error saving projects:', error);
      toast({ description: 'Failed to save projects. Please try again.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index !== result.destination.index) {
      reorderProjects(result.source.index, result.destination.index);
    }
  };

  const openAdd = () => {
    setEditingProject(null);
    setFormOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setFormOpen(true);
  };

  const handleFormSubmit = (values: Omit<Project, 'id'>) => {
    if (editingProject) {
      updateProject(editingProject.id, values);
    } else {
      addProject(values);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-sm text-muted-foreground">Drag to reorder — the order here is the order on the site.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {hasUnsavedChanges && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
          <p className="text-sm text-amber-900 dark:text-amber-200">You have unsaved changes.</p>
          <Button size="sm" onClick={handleSaveAll} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="projects" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {projects.map((project, index) => (
                  <Draggable key={project.id} draggableId={project.id} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`overflow-hidden transition-shadow ${snapshot.isDragging ? 'shadow-2xl' : ''}`}
                      >
                        <div className="flex items-stretch">
                          <div
                            {...provided.dragHandleProps}
                            className="flex items-center justify-center w-9 bg-muted/50 cursor-grab active:cursor-grabbing"
                            aria-label="Drag to reorder"
                          >
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                          </div>
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.title}
                              loading="lazy"
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover self-center rounded-md m-2 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted self-center rounded-md m-2 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm truncate">{project.title}</h4>
                              <p className="text-xs text-muted-foreground truncate">{project.titleZh}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {project.buttons.length} button{project.buttons.length === 1 ? '' : 's'}
                              </p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button size="sm" variant="outline" aria-label="Edit project" onClick={() => openEdit(project)}>
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button size="sm" variant="outline" aria-label="Delete project" onClick={() => setDeleteCandidate(project)}>
                                <Trash2 className="w-3.5 h-3.5 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <ProjectFormDialog
        open={formOpen}
        initial={editingProject}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <AlertDialog open={!!deleteCandidate} onOpenChange={(open) => !open && setDeleteCandidate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleteCandidate?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              The project is removed from the list now and deleted for good when you press “Save changes”.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteCandidate) deleteProject(deleteCandidate.id);
                setDeleteCandidate(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectManagement;
