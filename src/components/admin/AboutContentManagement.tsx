import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Save, Loader2, Briefcase, GraduationCap, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchAboutContent, AboutContentRow, AboutSectionContent } from "@/lib/aboutContent";

type LangKey = 'content' | 'content_zh';

const SECTION_META: { section: string; label: string; icon: typeof User; listKey: 'bullets' | 'paragraphs' }[] = [
  { section: 'about', label: 'About Me', icon: User, listKey: 'paragraphs' },
  { section: 'experience', label: 'Experience', icon: Briefcase, listKey: 'bullets' },
  { section: 'education', label: 'Education', icon: GraduationCap, listKey: 'bullets' },
];

const defaultContent = (label: string, listKey: 'bullets' | 'paragraphs'): AboutSectionContent => ({
  title: label,
  [listKey]: [],
});

const AboutContentManagement = () => {
  const [rows, setRows] = useState<AboutContentRow[]>([]);
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAboutContent();
        if (cancelled) return;
        // Make sure every section exists so the editor always shows all three.
        const complete = SECTION_META.map(meta => {
          const existing = data.find(r => r.section === meta.section);
          return existing ?? {
            id: crypto.randomUUID(),
            section: meta.section,
            content: defaultContent(meta.label, meta.listKey),
            content_zh: defaultContent(meta.label, meta.listKey),
          };
        });
        setRows(complete);
        setSavedSnapshot(JSON.stringify(complete));
      } catch (error) {
        console.error('Error loading about content:', error);
        toast({ description: 'Failed to load about content.', variant: 'destructive' });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [toast]);

  const hasChanges = !isLoading && JSON.stringify(rows) !== savedSnapshot;

  const updateSection = (section: string, lang: LangKey, updater: (content: AboutSectionContent) => AboutSectionContent) => {
    setRows(prev => prev.map(row =>
      row.section === section ? { ...row, [lang]: updater({ ...row[lang] }) } : row
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('about_content')
        .upsert(
          rows.map(row => ({
            section: row.section,
            content: row.content as never,
            content_zh: row.content_zh as never,
          })),
          { onConflict: 'section' }
        );
      if (error) throw error;
      setSavedSnapshot(JSON.stringify(rows));
      toast({ description: 'About content saved and live.' });
    } catch (error) {
      console.error('Error saving about content:', error);
      toast({ description: 'Failed to save about content. Please try again.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const renderLangEditor = (row: AboutContentRow, lang: LangKey, listKey: 'bullets' | 'paragraphs') => {
    const content = row[lang];
    const items = content[listKey] ?? [];
    const isZh = lang === 'content_zh';
    const itemLabel = listKey === 'paragraphs' ? (isZh ? '段落' : 'paragraph') : (isZh ? '要点' : 'bullet point');

    return (
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>{isZh ? '标题' : 'Title'}</Label>
          <Input
            value={content.title}
            onChange={(e) => updateSection(row.section, lang, c => ({ ...c, title: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>{listKey === 'paragraphs' ? (isZh ? '段落' : 'Paragraphs') : (isZh ? '要点' : 'Bullet points')}</Label>
          {items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={item}
                rows={listKey === 'paragraphs' ? 4 : 2}
                onChange={(e) => updateSection(row.section, lang, c => {
                  const list = [...(c[listKey] ?? [])];
                  list[index] = e.target.value;
                  return { ...c, [listKey]: list };
                })}
                className="flex-1"
              />
              <Button
                size="icon"
                variant="outline"
                aria-label={`Remove ${itemLabel}`}
                onClick={() => updateSection(row.section, lang, c => {
                  const list = [...(c[listKey] ?? [])];
                  list.splice(index, 1);
                  return { ...c, [listKey]: list };
                })}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateSection(row.section, lang, c => ({
              ...c,
              [listKey]: [...(c[listKey] ?? []), ''],
            }))}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isZh ? `添加${itemLabel}` : `Add ${itemLabel}`}
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">About Section</h2>
          <p className="text-sm text-muted-foreground">The intro paragraphs plus the Experience and Education cards.</p>
        </div>
      </div>

      {hasChanges && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 sticky top-16 z-30">
          <p className="text-sm text-amber-900 dark:text-amber-200">You have unsaved changes.</p>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {SECTION_META.map(meta => {
          const row = rows.find(r => r.section === meta.section);
          if (!row) return null;
          const Icon = meta.icon;
          return (
            <Card key={meta.section}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="w-4 h-4 text-primary" />
                  {meta.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="en">
                  <TabsList className="grid w-full max-w-xs grid-cols-2 mb-4">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="zh">中文</TabsTrigger>
                  </TabsList>
                  <TabsContent value="en">
                    {renderLangEditor(row, 'content', meta.listKey)}
                  </TabsContent>
                  <TabsContent value="zh">
                    {renderLangEditor(row, 'content_zh', meta.listKey)}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AboutContentManagement;
