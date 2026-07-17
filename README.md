# FitFlow - AI-Powered Fitness Coach

FitFlow is an intelligent fitness application that creates personalized workout routines and nutrition plans tailored to your unique goals, body type, and lifestyle. Using advanced AI technology, it delivers custom fitness plans that adapt to your preferences and needs.

## 🚀 Features

- **Personalized Fitness Plans**: Generate custom workout routines based on your fitness level, goals, and available equipment
- **Nutrition Advice**: Get tailored meal recommendations that align with your fitness goals
- **Adaptive AI**: Uses AI to create dynamic and evolving fitness plans
- **Dashboard**: Track your plans and active workouts in an intuitive dashboard
- **Export Functionality**: Download your fitness plan as a PDF

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL (via Prisma ORM)
- **AI Integration**: Pollinations.ai API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or pnpm
- PostgreSQL database

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-fitness-assistant.git
   cd ai-fitness-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the necessary variables (see `.env.example` if available, or ask for the required keys).
   - Database connection string
   - NextAuth secret

4. **Initialize Database**
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open the application**
   Navigate to `http://localhost:3000` in your browser.

## 🤸 How It Works

1. **User Profile Creation**: Enter your personal information including name, age, height, weight, fitness goals, and preferences
2. **Plan Generation**: The app sends your data to the AI model which crafts a customized plan
3. **Plan Review**: Review your custom fitness plan with detailed exercises and meal descriptions
4. **Action**: Start your workout directly from the app dashboard

### Fitness Goals Supported
- Weight Loss
- Muscle Gain
- Maintenance
- Endurance
- Flexibility

## 🤖 AI Integration

FitFlow uses the Pollinations.ai API to generate personalized fitness and nutrition plans. The application also includes a fallback system that generates quality plans even when the AI service is unavailable.

## 📱 Usage

1. Visit the homepage and click "Get Started"
2. Fill out your personal profile with fitness details
3. Submit your information to generate your custom plan
4. Review your workout and nutrition plan
5. Use the "Regenerate" button for an expanded plan with more content
6. Export your plan as a PDF for offline use

## 🏗️ Project Structure

```
ai-fitness-assistant/
├── app/                    # Next.js app directory
│   ├── api/                # API routes for AI generation
│   │   ├── generate-motivation/
│   │   └── generate-plan/
│   ├── globals.css         # Global styles
│   └── page.tsx            # Main application page
├── components/             # React components
│   ├── ui/                 # Shadcn/ui components
│   ├── header.tsx          # Page header
│   ├── hero-section.tsx    # Landing section
│   ├── plan-display.tsx    # Plan presentation
│   ├── user-form.tsx       # User profile form
│   └── ...                 # Other components
├── lib/                    # Utilities and types
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Utility functions
└── ...
```

## 🔧 API Endpoints

- `POST /api/generate-plan`: Generates personalized fitness and nutrition plans
- `GET /api/generate-motivation`: Provides motivational quotes

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

This application is ready for deployment on Vercel or other platforms that support Next.js applications.

For Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Import your project
3. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues

If you encounter any issues or have feature requests, please open an issue in the repository.

## 🆘 Support

For support, please open an issue in the repository.

---

Built with ❤️ using Next.js and AI technology

Your fitness journey starts here!
