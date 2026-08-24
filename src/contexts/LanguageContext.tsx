import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',

    // Hero Section
    'hero.hello': 'Hello, I\'m',
    'hero.name': 'James Chattock',
    'hero.cv': 'CV',
    'hero.contactInfo': 'Contact Info',
    'hero.cvTitle': 'Curriculum Vitae',
    'hero.downloadCV': 'Download CV',
    'hero.noCv': 'No CV uploaded yet.',

    // Projects Section
    'projects.browse': 'Browse My Recent',
    'projects.title': 'Projects',
    'projects.website': 'Website',
    'projects.github': 'Github',
    'projects.video': 'Video',
    'projects.project': 'Project',
    'projects.report': 'Report',
    'projects.html': 'HTML Document',

    // Contact Section
    'contact.getInTouch': 'Get in Touch',
    'contact.title': 'Contact Me',
    'contact.email': 'Email',
    'contact.linkedin': 'LinkedIn',
    'contact.linkedinProfile': 'LinkedIn Profile',
    'contact.wechat': 'WeChat ID',
    'contact.copied': 'WeChat ID copied to clipboard',

    // Footer
    'footer.rights': 'James Chattock. All Rights Reserved.',
  },
  zh: {
    // Navigation
    'nav.about': '关于',
    'nav.projects': '项目',
    'nav.contact': '联系',

    // Hero Section
    'hero.hello': '你好，我是',
    'hero.name': 'James Chattock',
    'hero.cv': '简历',
    'hero.contactInfo': '联系信息',
    'hero.cvTitle': '个人简历',
    'hero.downloadCV': '下载简历',
    'hero.noCv': '暂未上传简历。',

    // Projects Section
    'projects.browse': '浏览我最近的',
    'projects.title': '项目',
    'projects.website': '网站',
    'projects.github': 'Github',
    'projects.video': '视频',
    'projects.project': '项目',
    'projects.report': '报告',
    'projects.html': 'HTML文档',

    // Contact Section
    'contact.getInTouch': '联系我',
    'contact.title': '联系我',
    'contact.email': '邮箱',
    'contact.linkedin': 'LinkedIn',
    'contact.linkedinProfile': 'LinkedIn个人资料',
    'contact.wechat': '微信号',
    'contact.copied': '微信号已复制到剪贴板',

    // Footer
    'footer.rights': 'James Chattock。保留所有权利。',
  },
};

const LANGUAGE_STORAGE_KEY = 'portfolio-language';

const getInitialLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'en' || saved === 'zh') return saved;
  } catch {
    // localStorage unavailable (private mode etc.) — fall through
  }
  return 'en';
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'zh' : 'en';
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
      } catch {
        // ignore storage failures
      }
      return next;
    });
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
