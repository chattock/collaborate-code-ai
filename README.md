# James Chattock - Data Scientist Portfolio

A modern, responsive portfolio website showcasing my expertise in geospatial data science, machine learning, and web development.

## Features

- **Responsive Design**: Optimized for all devices and screen sizes
- **Multi-language Support**: English and Chinese language toggle
- **Interactive Projects**: Detailed project showcases with live demos
- **Contact Integration**: Built-in contact forms and booking system
- **Admin Panel**: Content management system for easy updates
- **Modern Tech Stack**: Built with React, TypeScript, and Tailwind CSS

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Database, Authentication, Storage)
- **Deployment**: Vercel/Netlify ready
- **Additional**: React Router, React Hook Form, Recharts

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd collaborate-code-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your Supabase credentials
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin panel components
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
├── pages/              # Main application pages
└── utils/              # Utility functions
```

## Deployment

This project is ready for deployment on platforms like Vercel, Netlify, or any static hosting service.

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting platform.

## Contributing

This is a personal portfolio project. For any suggestions or improvements, please feel free to open an issue or submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).