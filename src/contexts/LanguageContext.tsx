import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.contact': 'Contact',
    'nav.services': 'Services',
    
    // Hero Section
    'hero.hello': 'Hello, I\'m',
    'hero.name': 'James Chattock',
    'hero.title': 'Geospatial Data Scientist',
    'hero.cv': 'CV',
    'hero.contactInfo': 'Contact Info',
    'hero.cvTitle': 'Curriculum Vitae',
    'hero.cvContent': 'CV content would be displayed here.',
    'hero.cvDemo': 'For the demo, this would show the actual CV PDF content.',
    'hero.downloadCV': 'Download CV',
    
    // Services Section
    'services.explore': 'Explore My',
    'services.title': 'Services',
    'services.skills': 'Skills',
    'services.aboutMe': 'About Me',
    'services.experience': 'Experience',
    'services.education': 'Education',
    'services.gis': 'GIS Solutions',
    'services.gisDesc': 'Geospatial data Analysis with Esri products',
    'services.dataAnalysis': 'Data Analysis',
    'services.dataAnalysisDesc': 'Leveraging Python or R in Jupyter or RMarkdown for data driven insights',
    'services.ml': 'Machine Learning',
    'services.mlDesc': 'Building predictive models with scikit-learn',
    'services.webDev': 'Web Development',
    'services.webDevDesc': 'Creating and maintaining websites with HTML/CSS/JavaScript',
    'services.dataViz': 'Data Visualization',
    'services.dataVizDesc': 'Creating insightful visuals with Python or R based visualization packages',
    'services.webScraping': 'Web Scraping',
    'services.webScrapingDesc': 'Extracting data from websites',
    'services.database': 'Database Management',
    'services.databaseDesc': 'PostgreSQL for organizing and storing data',
    'services.bigData': 'Big Data Processing',
    'services.bigDataDesc': 'Handling large datasets with Spark SQL and TensorFlow',
    'services.dataCleaning': 'Data Cleaning',
    'services.dataCleaningDesc': 'Improving data quality',
    'services.experienceDesc1': '• GIS Consultant at ESRI',
    'services.experienceDesc2': '• Data Science Research Assistant at Both LSE and Manchester University',
    'services.experienceDesc3': '• 3+ years experience in Python, R, SQL, JavaScript and GIS technologies',
    'services.educationDesc1': '• M.Sc. Geographic Data Science - London School of Economics',
    'services.educationDesc2': '• IBM Data Science Professional Certificate',
    'services.educationDesc3': '• BA Chinese and Business Management - University of Manchester',
    'services.aboutDesc1': '• GIS Consultant at Esri UK, with a Master\'s Degree in Geographic Data Science from the London School of Economics (LSE).',
    'services.aboutDesc2': '• GIS skills with hands-on experience using Python, R, QGIS, and ArcGIS.',
    'services.paymentDesc': 'Meetings are Free. Payments for any services can be made here. All services are £20 per hour.',
    'services.bookMeeting': 'Book a Meeting',
    'services.paymentLink': 'Payment Link',
    
    // Contact Section
    'contact.getInTouch': 'Get in Touch',
    'contact.title': 'Contact Me',
    'contact.email': 'Email',
    'contact.linkedin': 'LinkedIn',
    'contact.linkedinProfile': 'LinkedIn Profile',
    
    // Footer
    'footer.copyright': 'Copyright © 2023 James Chattock. All Rights Reserved.',
    
    // Projects Section
    'projects.browse': 'Browse My Recent',
    'projects.title': 'Projects',
    'projects.website': 'Website',
    'projects.github': 'Github',
    'projects.video': 'Video',
    'projects.project': 'Project',
    'projects.report': 'Report',
    'projects.ukTrade': 'UK Trade in 1700s',
    'projects.wordRelations': 'Word Relationship Project',
    'projects.globalTemps': 'Global Temperatures',
    'projects.battleSkies': 'Battle of the Skies Demo',
    'projects.orsted': 'Orsted Project',
    'projects.fashionESG': 'Fashion ESG Analysis',
    'projects.retailAnalytics': 'Retail Analytics Dashboard',
    'projects.mlNetwork': 'ML Network Analysis',
    'projects.propertyAnalysis': 'Property Analysis Tool',
    'projects.supplyChain': 'Supply Chain Optimization',
    'projects.sentimentAnalysis': 'Sentiment Analysis Platform',
    'projects.portfolioOptimizer': 'Portfolio Optimizer',
    
    // Booking Dialog
    'booking.title': 'Book a Free Consultation',
    'booking.description': 'Schedule a 30-minute consultation to discuss your project requirements. Available times are within the next week.',
    'booking.name': 'Name',
    'booking.email': 'Email',
    'booking.phone': 'Phone',
    'booking.company': 'Company',
    'booking.message': 'Message',
    'booking.messagePlaceholder': 'Tell me about your project or any specific requirements...',
    'booking.date': 'Date',
    'booking.time': 'Time',
    'booking.pickDate': 'Pick a date',
    'booking.selectTime': 'Select time',
    'booking.cancel': 'Cancel',
    'booking.bookConsultation': 'Book Consultation',
    'booking.booking': 'Booking...',
    'booking.success': 'Consultation Booked!',
    'booking.successDesc': 'Your booking has been confirmed. Check your email for details.',
    'booking.saved': 'Booking Saved',
    'booking.savedDesc': 'Your consultation is booked but there was an issue sending confirmation emails. You\'ll be contacted directly.',
    'booking.failed': 'Booking Failed',
    'booking.failedDesc': 'Something went wrong. Please try again.',
  },
  zh: {
    // Navigation  
    'nav.about': '关于',
    'nav.projects': '项目',
    'nav.skills': '技能',
    'nav.contact': '联系',
    'nav.services': '服务',
    
    // Hero Section
    'hero.hello': '你好，我是',
    'hero.name': 'James Chattock',
    'hero.title': '地理数据科学家',
    'hero.cv': '简历',
    'hero.contactInfo': '联系信息',
    'hero.cvTitle': '个人简历',
    'hero.cvContent': '简历内容将在此处显示。',
    'hero.cvDemo': '在演示中，这里会显示实际的简历PDF内容。',
    'hero.downloadCV': '下载简历',
    
    // Services Section
    'services.explore': '探索我的',
    'services.title': '服务',
    'services.skills': '技能',
    'services.aboutMe': '关于我',
    'services.experience': '经验',
    'services.education': '教育',
    'services.gis': 'GIS解决方案',
    'services.gisDesc': '使用Esri产品进行地理空间数据分析',
    'services.dataAnalysis': '数据分析',
    'services.dataAnalysisDesc': '在Jupyter或RMarkdown中使用Python或R获得数据驱动的洞察',
    'services.ml': '机器学习',
    'services.mlDesc': '使用scikit-learn构建预测模型',
    'services.webDev': '网页开发',
    'services.webDevDesc': '使用HTML/CSS/JavaScript创建和维护网站',
    'services.dataViz': '数据可视化',
    'services.dataVizDesc': '使用基于Python或R的可视化包创建有洞察力的视觉效果',
    'services.webScraping': '网页抓取',
    'services.webScrapingDesc': '从网站提取数据',
    'services.database': '数据库管理',
    'services.databaseDesc': '使用PostgreSQL组织和存储数据',
    'services.bigData': '大数据处理',
    'services.bigDataDesc': '使用Spark SQL和TensorFlow处理大型数据集',
    'services.dataCleaning': '数据清理',
    'services.dataCleaningDesc': '提高数据质量',
    'services.experienceDesc1': '• ESRI GIS顾问',
    'services.experienceDesc2': '• LSE和曼彻斯特大学数据科学研究助理',
    'services.experienceDesc3': '• 3年以上Python、R、SQL、JavaScript和GIS技术经验',
    'services.educationDesc1': '• 地理数据科学硕士 - 伦敦政治经济学院',
    'services.educationDesc2': '• IBM数据科学专业证书',
    'services.educationDesc3': '• 中文与商业管理学士 - 曼彻斯特大学',
    'services.aboutDesc1': '• Esri英国GIS顾问，拥有伦敦政治经济学院(LSE)地理数据科学硕士学位。',
    'services.aboutDesc2': '• 具备使用Python、R、QGIS和ArcGIS的实际GIS技能。',
    'services.paymentDesc': '会议免费。任何服务的付款都可以在这里进行。所有服务每小时£20。',
    'services.bookMeeting': '预约会议',
    'services.paymentLink': '付款链接',
    
    // Contact Section
    'contact.getInTouch': '联系我',
    'contact.title': '联系我',
    'contact.email': '邮箱',
    'contact.linkedin': 'LinkedIn',
    'contact.linkedinProfile': 'LinkedIn个人资料',
    
    // Footer
    'footer.copyright': '版权所有 © 2023 James Chattock。保留所有权利。',
    
    // Projects Section
    'projects.browse': '浏览我最近的',
    'projects.title': '项目',
    'projects.website': '网站',
    'projects.github': 'Github',
    'projects.video': '视频',
    'projects.project': '项目',
    'projects.report': '报告',
    'projects.ukTrade': '18世纪英国贸易',
    'projects.wordRelations': '词汇关系项目',
    'projects.globalTemps': '全球气温分析',
    'projects.battleSkies': '天空战争演示',
    'projects.orsted': 'Ørsted金融分析',
    'projects.fashionESG': '英国时尚ESG报告',
    'projects.chineseDevelopment': '中国在内罗毕的发展',
    'projects.californiaFires': '加州火灾预测',
    'projects.glastonbury': '格拉斯顿伯里音乐节经济评估',
    'projects.gentrification': '芝加哥中产阶级化驱动因素',
    'projects.elizabethLine': '伊丽莎白线对房价的影响',
    'projects.portfolioOptimizer': '投资组合优化器',
    
    // Booking Dialog
    'booking.title': '预约免费咨询',
    'booking.description': '安排30分钟咨询讨论您的项目需求。可预约时间在下周内。',
    'booking.name': '姓名',
    'booking.email': '邮箱',
    'booking.phone': '电话',
    'booking.company': '公司',
    'booking.message': '留言',
    'booking.messagePlaceholder': '告诉我关于您的项目或任何具体要求...',
    'booking.date': '日期',
    'booking.time': '时间',
    'booking.pickDate': '选择日期',
    'booking.selectTime': '选择时间',
    'booking.cancel': '取消',
    'booking.bookConsultation': '预约咨询',
    'booking.booking': '预约中...',
    'booking.success': '咨询已预约！',
    'booking.successDesc': '您的预约已确认。请查看您的邮箱获取详情。',
    'booking.saved': '预约已保存',
    'booking.savedDesc': '您的咨询已预约，但发送确认邮件时出现问题。我们会直接联系您。',
    'booking.failed': '预约失败',
    'booking.failedDesc': '出现问题。请重试。',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
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