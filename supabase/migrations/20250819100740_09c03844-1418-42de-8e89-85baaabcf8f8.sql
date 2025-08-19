-- Create storage bucket for project images and CV files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-files', 'project-files', true);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  image_url TEXT,
  buttons JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin settings table
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_name TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (you may want to restrict this later with authentication)
CREATE POLICY "Allow all access to projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to admin_settings" ON public.admin_settings FOR ALL USING (true) WITH CHECK (true);

-- Create storage policies for project files
CREATE POLICY "Allow all access to project files" ON storage.objects 
FOR ALL USING (bucket_id = 'project-files') WITH CHECK (bucket_id = 'project-files');

-- Create update triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default projects (migrating from your current data)
INSERT INTO public.projects (title, title_zh, image_url, buttons, display_order) VALUES
('UK Trade in 1700s', '18世纪英国贸易', '/src/assets/project-uk-trade.jpg', '[{"id": "1-1", "type": "website", "label": "Website", "url": "https://chattock.github.io/Edmond/"}, {"id": "1-2", "type": "github", "label": "Github", "url": "https://github.com/chattock/Edmond"}]', 1),
('Word Relationship Project', '词汇关系项目', '/src/assets/project-word-relations.jpg', '[{"id": "2-1", "type": "website", "label": "Website", "url": "https://chattock.github.io/Crisis/"}, {"id": "2-2", "type": "github", "label": "Github", "url": "https://github.com/chattock/Crisis"}]', 2),
('Global Temperatures', '全球气温分析', '/src/assets/project-global-temps.jpg', '[{"id": "3-1", "type": "video", "label": "Video", "url": "https://www.youtube.com/watch?v=zUuyePLL3rw&t=165s"}, {"id": "3-2", "type": "report", "label": "Project", "url": "#"}, {"id": "3-3", "type": "github", "label": "Github", "url": "https://github.com/chattock/data-vis-essay/blob/main/How%20to%20use%20CIMP6%20Databass-Copy1.ipynb"}]', 3),
('Battle of the Skies Demo', '天空战争演示', '/src/assets/project-climate-mapping.jpg', '[{"id": "4-1", "type": "website", "label": "Website", "url": "https://chattock.github.io/climate-mapping/"}, {"id": "4-2", "type": "github", "label": "Github", "url": "https://github.com/chattock/climate-mapping"}]', 4),
('Orsted Project', 'Ørsted金融分析', '/src/assets/project-orsted.jpg', '[{"id": "5-1", "type": "report", "label": "Report", "url": "#"}]', 5),
('Fashion ESG Analysis', '英国时尚ESG报告', '/src/assets/project-fashion-esg.jpg', '[{"id": "6-1", "type": "report", "label": "Report", "url": "#"}]', 6),
('Chinese Development', '中国在内罗毕的发展', '/src/assets/project-retail-analytics.jpg', '[{"id": "7-1", "type": "report", "label": "Report", "url": "#"}, {"id": "7-2", "type": "website", "label": "Website", "url": "#"}]', 7),
('California Fires', '加州火灾预测', '/src/assets/project-ml-network.jpg', '[{"id": "8-1", "type": "report", "label": "Report", "url": "#"}, {"id": "8-2", "type": "github", "label": "Github", "url": "#"}]', 8),
('Glastonbury', '格拉斯顿伯里音乐节经济评估', '/src/assets/project-property-analysis.jpg', '[{"id": "9-1", "type": "report", "label": "Report", "url": "#"}]', 9),
('Gentrification', '芝加哥中产阶级化驱动因素', '/src/assets/project-supply-chain.jpg', '[{"id": "10-1", "type": "website", "label": "Website", "url": "#"}]', 10),
('Elizabeth Line', '伊丽莎白线对房价的影响', '/src/assets/project-sentiment-analysis.jpg', '[{"id": "11-1", "type": "report", "label": "Report", "url": "#"}, {"id": "11-2", "type": "website", "label": "Website", "url": "#"}]', 11),
('Portfolio Optimizer', '投资组合优化器', '/src/assets/project-portfolio-optimizer.jpg', '[{"id": "12-1", "type": "github", "label": "Github", "url": "#"}]', 12);

-- Insert default admin settings
INSERT INTO public.admin_settings (setting_name, setting_value) VALUES
('show_booking_section', 'true'),
('admin_logged_in', 'false');