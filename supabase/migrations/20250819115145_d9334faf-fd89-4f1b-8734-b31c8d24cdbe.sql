-- Create skills table
CREATE TABLE public.skills (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    title_zh text NOT NULL,
    description text NOT NULL,
    description_zh text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create policies for skills (public read access)
CREATE POLICY "Anyone can view skills" 
ON public.skills 
FOR SELECT 
USING (true);

-- Only authenticated users can manage skills (for admin)
CREATE POLICY "Authenticated users can manage skills" 
ON public.skills 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create about_content table for managing about me sections
CREATE TABLE public.about_content (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    section text NOT NULL, -- 'experience', 'education', 'about'  
    content jsonb NOT NULL, -- Store bullet points and descriptions
    content_zh jsonb NOT NULL, -- Chinese translations
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(section)
);

-- Enable RLS
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- Create policies for about_content (public read access)
CREATE POLICY "Anyone can view about content" 
ON public.about_content 
FOR SELECT 
USING (true);

-- Only authenticated users can manage about content (for admin)
CREATE POLICY "Authenticated users can manage about content" 
ON public.about_content 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create triggers for updating timestamps
CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON public.skills
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_content_updated_at
    BEFORE UPDATE ON public.about_content
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default skills data
INSERT INTO public.skills (title, title_zh, description, description_zh, display_order) VALUES
('GIS Solutions', 'GIS解决方案', 'Geospatial data Analysis with Esri products', '使用Esri产品进行地理空间数据分析', 1),
('Data Analysis', '数据分析', 'Leveraging Python or R in Jupyter or RMarkdown for data driven insights', '在Jupyter或RMarkdown中使用Python或R获得数据驱动的洞察', 2),
('Machine Learning', '机器学习', 'Building predictive models with scikit-learn', '使用scikit-learn构建预测模型', 3),
('Web Development', '网页开发', 'Creating and maintaining websites with HTML/CSS/JavaScript', '使用HTML/CSS/JavaScript创建和维护网站', 4),
('Data Visualization', '数据可视化', 'Creating insightful visuals with Python or R based visualization packages', '使用基于Python或R的可视化包创建有洞察力的视觉效果', 5),
('Web Scraping', '网页抓取', 'Extracting data from websites', '从网站提取数据', 6),
('Database Management', '数据库管理', 'PostgreSQL for organizing and storing data', '使用PostgreSQL组织和存储数据', 7),
('Big Data Processing', '大数据处理', 'Handling large datasets with Spark SQL and TensorFlow', '使用Spark SQL和TensorFlow处理大型数据集', 8),
('Data Cleaning', '数据清理', 'Improving data quality', '提高数据质量', 9);

-- Insert default about content
INSERT INTO public.about_content (section, content, content_zh) VALUES
('experience', 
 '{"title": "Experience", "bullets": ["GIS Consultant at ESRI", "Data Science Research Assistant at Both LSE and Manchester University", "3+ years experience in Python, R, SQL, JavaScript and GIS technologies"]}',
 '{"title": "经验", "bullets": ["ESRI GIS顾问", "LSE和曼彻斯特大学数据科学研究助理", "3年以上Python、R、SQL、JavaScript和GIS技术经验"]}'
),
('education',
 '{"title": "Education", "bullets": ["M.Sc. Geographic Data Science - London School of Economics", "IBM Data Science Professional Certificate", "BA Chinese and Business Management - University of Manchester"]}',
 '{"title": "教育", "bullets": ["地理数据科学硕士 - 伦敦政治经济学院", "IBM数据科学专业证书", "中文与商业管理学士 - 曼彻斯特大学"]}'
),
('about',
 '{"title": "About Me", "paragraphs": ["GIS Consultant at Esri UK, with a Master''s Degree in Geographic Data Science from the London School of Economics (LSE).", "GIS skills with hands-on experience using Python, R, QGIS, and ArcGIS."]}',
 '{"title": "关于我", "paragraphs": ["Esri英国GIS顾问，拥有伦敦政治经济学院(LSE)地理数据科学硕士学位。", "具备使用Python、R、QGIS和ArcGIS的实际GIS技能。"]}'
);