import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminSave } from "@/hooks/useAdminSave";

interface AboutContent {
  id: string;
  section: string;
  content: any;
  content_zh: any;
}

const AboutContentManagement = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent[]>([]);
  const [initialContent, setInitialContent] = useState<AboutContent[]>([]);
  const { toast } = useToast();

  // Save function for the hook
  const saveContentChanges = async () => {
    try {
      const updates = aboutContent.map(item => 
        supabase
          .from('about_content')
          .upsert(
            { section: item.section, content: item.content, content_zh: item.content_zh },
            { onConflict: 'section' }
          )
      );

      await Promise.all(updates);
      setInitialContent([...aboutContent]);
    } catch (error) {
      console.error('Error saving about content:', error);
      throw error;
    }
  };

  // Register with admin save system
  const hasChanges = JSON.stringify(aboutContent) !== JSON.stringify(initialContent);
  useAdminSave(saveContentChanges, [hasChanges]);

  // Load about content from Supabase
  const loadAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('section');
      
      if (error) throw error;
      const content = data || [];
      setAboutContent(content);
      setInitialContent([...content]);
    } catch (error) {
      console.error('Error loading about content:', error);
      toast({
        title: "Error",
        description: "Failed to load about content",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadAboutContent();
  }, []);

  const updateContent = (section: string, content: any, content_zh: any) => {
    // Update local state only - don't save to Supabase immediately
    setAboutContent(prev => {
      const updated = prev.map(item => 
        item.section === section 
          ? { ...item, content, content_zh }
          : item
      );
      
      // If section doesn't exist, add it
      if (!updated.find(item => item.section === section)) {
        updated.push({ id: Date.now().toString(), section, content, content_zh });
      }
      
      return updated;
    });
  };

  const addBulletPoint = (section: string, language: 'en' | 'zh') => {
    const contentItem = aboutContent.find(item => item.section === section);
    if (!contentItem) return;

    const updatedContent = { ...contentItem.content };
    const updatedContent_zh = { ...contentItem.content_zh };

    if (language === 'en') {
      if (section === 'about') {
        if (!updatedContent.paragraphs) updatedContent.paragraphs = [];
        updatedContent.paragraphs.push('');
      } else {
        if (!updatedContent.bullets) updatedContent.bullets = [];
        updatedContent.bullets.push('');
      }
    } else {
      if (section === 'about') {
        if (!updatedContent_zh.paragraphs) updatedContent_zh.paragraphs = [];
        updatedContent_zh.paragraphs.push('');
      } else {
        if (!updatedContent_zh.bullets) updatedContent_zh.bullets = [];
        updatedContent_zh.bullets.push('');
      }
    }

    updateContent(section, updatedContent, updatedContent_zh);
  };

  const removeBulletPoint = (section: string, language: 'en' | 'zh', index: number) => {
    const contentItem = aboutContent.find(item => item.section === section);
    if (!contentItem) return;

    const updatedContent = { ...contentItem.content };
    const updatedContent_zh = { ...contentItem.content_zh };

    if (language === 'en') {
      if (section === 'about') {
        updatedContent.paragraphs.splice(index, 1);
      } else {
        updatedContent.bullets.splice(index, 1);
      }
    } else {
      if (section === 'about') {
        updatedContent_zh.paragraphs.splice(index, 1);
      } else {
        updatedContent_zh.bullets.splice(index, 1);
      }
    }

    updateContent(section, updatedContent, updatedContent_zh);
  };

  const updateBulletPoint = (section: string, language: 'en' | 'zh', index: number, value: string) => {
    const contentItem = aboutContent.find(item => item.section === section);
    if (!contentItem) return;

    const updatedContent = { ...contentItem.content };
    const updatedContent_zh = { ...contentItem.content_zh };

    if (language === 'en') {
      if (section === 'about') {
        updatedContent.paragraphs[index] = value;
      } else {
        updatedContent.bullets[index] = value;
      }
    } else {
      if (section === 'about') {
        updatedContent_zh.paragraphs[index] = value;
      } else {
        updatedContent_zh.bullets[index] = value;
      }
    }

    updateContent(section, updatedContent, updatedContent_zh);
  };

  const renderContentSection = (section: string, title: string) => {
    const contentItem = aboutContent.find(item => item.section === section);
    if (!contentItem) return null;

    const isAboutSection = section === 'about';
    const contentKey = isAboutSection ? 'paragraphs' : 'bullets';

    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="zh">中文</TabsTrigger>
            </TabsList>
            
            <TabsContent value="en" className="space-y-4">
              <div className="space-y-2">
                {contentItem.content[contentKey]?.map((item: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={item}
                      onChange={(e) => updateBulletPoint(section, 'en', index, e.target.value)}
                      placeholder={isAboutSection ? "Paragraph text..." : "Bullet point..."}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeBulletPoint(section, 'en', index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )) || []}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addBulletPoint(section, 'en')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add {isAboutSection ? 'Paragraph' : 'Bullet Point'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="zh" className="space-y-4">
              <div className="space-y-2">
                {contentItem.content_zh[contentKey]?.map((item: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={item}
                      onChange={(e) => updateBulletPoint(section, 'zh', index, e.target.value)}
                      placeholder={isAboutSection ? "段落内容..." : "项目符号..."}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeBulletPoint(section, 'zh', index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )) || []}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addBulletPoint(section, 'zh')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加{isAboutSection ? '段落' : '项目符号'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">About Content Management</h3>
      
      <div className="space-y-6">
        {renderContentSection('experience', 'Experience')}
        {renderContentSection('education', 'Education')}
        {renderContentSection('about', 'About Me')}
      </div>
    </div>
  );
};

export default AboutContentManagement;