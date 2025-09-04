import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit, Plus, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminSave } from "@/hooks/useAdminSave";

interface Skill {
  id: string;
  title: string;
  title_zh: string;
  description: string;
  description_zh: string;
  display_order: number;
}

const SkillsManagement = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [initialSkills, setInitialSkills] = useState<Skill[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newSkill, setNewSkill] = useState({
    title: '',
    title_zh: '',
    description: '',
    description_zh: ''
  });
  const { toast } = useToast();

  // Save function for the hook
  const saveSkillsChanges = async () => {
    try {
      // Save skill updates
      const skillUpdates = skills.map(skill => 
        supabase
          .from('skills')
          .upsert({
            id: skill.id,
            title: skill.title,
            title_zh: skill.title_zh,
            description: skill.description,
            description_zh: skill.description_zh,
            display_order: skill.display_order
          })
      );

      await Promise.all(skillUpdates);
      setInitialSkills([...skills]);
    } catch (error) {
      console.error('Error saving skills:', error);
      throw error;
    }
  };

  // Register with admin save system
  const hasChanges = JSON.stringify(skills) !== JSON.stringify(initialSkills);
  useAdminSave(saveSkillsChanges, [hasChanges]);

  // Load skills from Supabase
  const loadSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      const loadedSkills = data || [];
      setSkills(loadedSkills);
      setInitialSkills([...loadedSkills]);
    } catch (error) {
      console.error('Error loading skills:', error);
      toast({
        title: "Error",
        description: "Failed to load skills",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleSave = async () => {
    try {
      const maxOrder = Math.max(...skills.map(s => s.display_order), 0);
      
      const { error } = await supabase
        .from('skills')
        .insert({
          ...newSkill,
          display_order: maxOrder + 1
        });

      if (error) throw error;

      setNewSkill({ title: '', title_zh: '', description: '', description_zh: '' });
      setIsAddOpen(false);
      loadSkills();
      
      toast({
        title: "Success",
        description: "Skill added successfully"
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive"
      });
    }
  };

  const handleEdit = () => {
    if (!editingSkill) return;

    // Update local state only
    setSkills(prev => prev.map(skill => 
      skill.id === editingSkill.id ? editingSkill : skill
    ));
    
    setEditingSkill(null);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;

      loadSkills();
      
      toast({
        title: "Success",
        description: "Skill deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive"
      });
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedSkills = Array.from(skills);
    const [reorderedSkill] = reorderedSkills.splice(result.source.index, 1);
    reorderedSkills.splice(result.destination.index, 0, reorderedSkill);

    // Update display_order for all skills
    const updatedSkills = reorderedSkills.map((skill, index) => ({
      ...skill,
      display_order: index + 1
    }));

    setSkills(updatedSkills);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Skills Management</h3>
        <Button onClick={() => setIsAddOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="skills">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {skills.map((skill, index) => (
                <Draggable key={skill.id} draggableId={skill.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{skill.title}</h4>
                          <p className="text-sm text-muted-foreground">{skill.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingSkill(skill)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(skill.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

      {/* Add Skill Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title (English)</Label>
              <Input
                id="title"
                value={newSkill.title}
                onChange={(e) => setNewSkill({...newSkill, title: e.target.value})}
                placeholder="Skill title in English"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title_zh">Title (Chinese)</Label>
              <Input
                id="title_zh"
                value={newSkill.title_zh}
                onChange={(e) => setNewSkill({...newSkill, title_zh: e.target.value})}
                placeholder="Skill title in Chinese"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (English)</Label>
              <Textarea
                id="description"
                value={newSkill.description}
                onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                placeholder="Skill description in English"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description_zh">Description (Chinese)</Label>
              <Textarea
                id="description_zh"
                value={newSkill.description_zh}
                onChange={(e) => setNewSkill({...newSkill, description_zh: e.target.value})}
                placeholder="Skill description in Chinese"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">Add Skill</Button>
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Skill Dialog */}
      <Dialog open={!!editingSkill} onOpenChange={() => setEditingSkill(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
          </DialogHeader>
          {editingSkill && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_title">Title (English)</Label>
                <Input
                  id="edit_title"
                  value={editingSkill.title}
                  onChange={(e) => setEditingSkill({...editingSkill, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_title_zh">Title (Chinese)</Label>
                <Input
                  id="edit_title_zh"
                  value={editingSkill.title_zh}
                  onChange={(e) => setEditingSkill({...editingSkill, title_zh: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_description">Description (English)</Label>
                <Textarea
                  id="edit_description"
                  value={editingSkill.description}
                  onChange={(e) => setEditingSkill({...editingSkill, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_description_zh">Description (Chinese)</Label>
                <Textarea
                  id="edit_description_zh"
                  value={editingSkill.description_zh}
                  onChange={(e) => setEditingSkill({...editingSkill, description_zh: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEdit} className="flex-1">Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingSkill(null)} className="flex-1">Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillsManagement;