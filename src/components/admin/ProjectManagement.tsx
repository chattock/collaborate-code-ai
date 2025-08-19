import { useState } from 'react';
import { Plus, Edit, Trash2, Upload, X, Link, FileText, Github, Globe, Video, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProject, Project, ProjectButton } from '@/contexts/ProjectContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useDropzone } from 'react-dropzone';
import { uploadReportFile } from '@/utils/reportUpload';

const ProjectManagement = () => {
  const { projects, addProject, updateProject, deleteProject, reorderProjects, hasUnsavedChanges: projectChanges, saveChanges: saveProjectChanges } = useProject();
  const { hasUnsavedChanges: adminChanges, saveChanges: saveAdminChanges } = useAdmin();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    titleZh: '',
    introduction: '',
    introductionZh: '',
    image: '',
    buttons: []
  });
  const hasUnsavedChanges = projectChanges || adminChanges;
  const [imageFiles, setImageFiles] = useState<{[key: string]: string}>({});

  const buttonIcons = {
    report: FileText,
    website: Globe,
    github: Github,
    video: Video
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target?.result as string;
          const tempId = editingProject?.id || 'new';
          setImageFiles(prev => ({ ...prev, [tempId]: base64String }));
          
          if (editingProject) {
            setEditingProject(prev => prev ? { ...prev, image: base64String } : null);
          } else {
            setNewProject(prev => ({ ...prev, image: base64String }));
          }
        };
        reader.readAsDataURL(file);
      }
    }
  });

  const handleFileUpload = async (buttonId: string, file: File) => {
    try {
      const projectId = editingProject?.id || 'new';
      const url = await uploadReportFile(file, projectId, buttonId);
      updateButton(buttonId, { url, fileName: file.name });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  };

  const addButton = () => {
    const newButton: ProjectButton = {
      id: Date.now().toString(),
      type: 'website',
      label: '',
      url: ''
    };
    
    if (editingProject) {
      setEditingProject(prev => prev ? {
        ...prev,
        buttons: [...prev.buttons, newButton]
      } : null);
    } else {
      setNewProject(prev => ({
        ...prev,
        buttons: [...(prev.buttons || []), newButton]
      }));
    }
  };

  const removeButton = (buttonId: string) => {
    if (editingProject) {
      setEditingProject(prev => prev ? {
        ...prev,
        buttons: prev.buttons.filter(b => b.id !== buttonId)
      } : null);
    } else {
      setNewProject(prev => ({
        ...prev,
        buttons: (prev.buttons || []).filter(b => b.id !== buttonId)
      }));
    }
  };

  const updateButton = (buttonId: string, updates: Partial<ProjectButton>) => {
    if (editingProject) {
      setEditingProject(prev => prev ? {
        ...prev,
        buttons: prev.buttons.map(b => b.id === buttonId ? { ...b, ...updates } : b)
      } : null);
    } else {
      setNewProject(prev => ({
        ...prev,
        buttons: (prev.buttons || []).map(b => b.id === buttonId ? { ...b, ...updates } : b)
      }));
    }
  };

  const handleSave = () => {
    if (editingProject) {
      updateProject(editingProject.id, editingProject);
      setEditingProject(null);
    } else {
      if (newProject.title && newProject.titleZh) {
        addProject(newProject as Omit<Project, 'id'>);
        setNewProject({ title: '', titleZh: '', introduction: '', introductionZh: '', image: '', buttons: [] });
        setIsAddOpen(false);
      }
    }
  };

  const saveAllChanges = async () => {
    try {
      console.log('Saving all changes...');
      await Promise.all([
        projectChanges ? saveProjectChanges() : Promise.resolve(),
        adminChanges ? saveAdminChanges() : Promise.resolve()
      ]);
      console.log('All changes saved successfully');
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes. Please try again.');
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex !== destinationIndex) {
      reorderProjects(sourceIndex, destinationIndex);
    }
  };

  const currentProject = editingProject || newProject;
  const currentButtons = currentProject.buttons || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Project Management</h3>
        <div className="flex gap-2">
          {hasUnsavedChanges && (
            <Button onClick={saveAllChanges} variant="default">
              Save All Changes
            </Button>
          )}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title (English)</Label>
                  <Input
                    id="title"
                    value={newProject.title}
                    onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="titleZh">Title (Chinese)</Label>
                  <Input
                    id="titleZh"
                    value={newProject.titleZh}
                    onChange={(e) => setNewProject(prev => ({ ...prev, titleZh: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="introduction">Introduction (English)</Label>
                  <Input
                    id="introduction"
                    value={newProject.introduction}
                    onChange={(e) => setNewProject(prev => ({ ...prev, introduction: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="introductionZh">Introduction (Chinese)</Label>
                  <Input
                    id="introductionZh"
                    value={newProject.introductionZh}
                    onChange={(e) => setNewProject(prev => ({ ...prev, introductionZh: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Project Image</Label>
                  <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary">
                    <input {...getInputProps()} />
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Drop an image here or click to select</p>
                  </div>
                  {newProject.image && (
                    <img src={newProject.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Buttons</Label>
                    <Button type="button" onClick={addButton} size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Button
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {currentButtons.map((button, index) => (
                      <Card key={button.id} className="p-3">
                        <div className="flex gap-2 items-start">
                          <div className="flex-1 space-y-2">
                            <div className="flex gap-2">
                              <Select 
                                value={button.type} 
                                onValueChange={(value: any) => updateButton(button.id, { type: value })}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="report">Report</SelectItem>
                                  <SelectItem value="website">Website</SelectItem>
                                  <SelectItem value="github">Github</SelectItem>
                                  <SelectItem value="video">Video</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                placeholder="Button label"
                                value={button.label}
                                onChange={(e) => updateButton(button.id, { label: e.target.value })}
                              />
                            </div>
                            {button.type !== 'report' && (
                              <Input
                                placeholder="URL"
                                value={button.url || ''}
                                onChange={(e) => updateButton(button.id, { url: e.target.value })}
                              />
                            )}
                            {button.type === 'report' && (
                              <div>
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleFileUpload(button.id, file);
                                    }
                                  }}
                                  className="hidden"
                                  id={`file-${button.id}`}
                                />
                                <label
                                  htmlFor={`file-${button.id}`}
                                  className="border-2 border-dashed border-gray-300 rounded p-2 text-center cursor-pointer hover:border-primary block"
                                >
                                  <FileText className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                                <p className="text-xs text-gray-600">
                                  {button.fileName || (button.url && !button.url.startsWith('data:') ? 'File uploaded' : 'Upload PDF/Word')}
                                </p>
                                </label>
                              {(button.fileName || (button.url && !button.url.startsWith('data:'))) && (
                                <p className="text-xs text-green-600 mt-1">✓ File uploaded: {button.fileName || 'Report file'}</p>
                              )}
                              </div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeButton(button.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave}>Add Project</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>✓ Connected to Supabase:</strong> All changes are automatically saved to your backend and sync across devices.
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="projects" direction="vertical">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="space-y-4"
            >
              {projects.map((project, index) => (
                <Draggable key={project.id} draggableId={project.id} index={index}>
                  {(provided, snapshot) => (
                    <Card 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`group hover:shadow-lg transition-all duration-300 ${
                        snapshot.isDragging ? 'shadow-2xl rotate-2' : ''
                      }`}
                    >
                      <div className="flex">
                        <div 
                          {...provided.dragHandleProps}
                          className="flex items-center justify-center w-8 bg-muted/50 cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 flex">
                          <div className="w-24 h-24 overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4 flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-sm mb-1">{project.title}</h4>
                              <p className="text-xs text-muted-foreground">{project.titleZh}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingProject(project)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteProject(project.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
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

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title (English)</Label>
                <Input
                  id="edit-title"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-titleZh">Title (Chinese)</Label>
                <Input
                  id="edit-titleZh"
                  value={editingProject.titleZh}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, titleZh: e.target.value } : null)}
                />
                </div>
                <div>
                  <Label htmlFor="edit-introduction">Introduction (English)</Label>
                  <Input
                    id="edit-introduction"
                    value={editingProject.introduction}
                    onChange={(e) => setEditingProject(prev => prev ? { ...prev, introduction: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-introductionZh">Introduction (Chinese)</Label>
                  <Input
                    id="edit-introductionZh"
                    value={editingProject.introductionZh}
                    onChange={(e) => setEditingProject(prev => prev ? { ...prev, introductionZh: e.target.value } : null)}
                  />
                </div>
                
              <div>
                <Label>Project Image</Label>
                <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary">
                  <input {...getInputProps()} />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Drop an image here or click to select</p>
                </div>
                {editingProject.image && (
                  <img src={editingProject.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Buttons</Label>
                  <Button type="button" onClick={addButton} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Button
                  </Button>
                </div>
                <div className="space-y-2">
                  {currentButtons.map((button) => (
                    <Card key={button.id} className="p-3">
                      <div className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                          <div className="flex gap-2">
                            <Select 
                              value={button.type} 
                              onValueChange={(value: any) => updateButton(button.id, { type: value })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="report">Report</SelectItem>
                                <SelectItem value="website">Website</SelectItem>
                                <SelectItem value="github">Github</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="Button label"
                              value={button.label}
                              onChange={(e) => updateButton(button.id, { label: e.target.value })}
                            />
                          </div>
                          {button.type !== 'report' && (
                            <Input
                              placeholder="URL"
                              value={button.url || ''}
                              onChange={(e) => updateButton(button.id, { url: e.target.value })}
                            />
                          )}
                          {button.type === 'report' && (
                            <div>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(button.id, file);
                                  }
                                }}
                                className="hidden"
                                id={`edit-file-${button.id}`}
                              />
                              <label
                                htmlFor={`edit-file-${button.id}`}
                                className="border-2 border-dashed border-gray-300 rounded p-2 text-center cursor-pointer hover:border-primary block"
                              >
                                <FileText className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                                <p className="text-xs text-gray-600">
                                  {button.fileName || (button.url && !button.url.startsWith('data:') ? 'File uploaded' : 'Upload PDF/Word')}
                                </p>
                              </label>
                              {(button.fileName || (button.url && !button.url.startsWith('data:'))) && (
                                <p className="text-xs text-green-600 mt-1">✓ File uploaded: {button.fileName || 'Report file'}</p>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeButton(button.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingProject(null)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectManagement;