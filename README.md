# FitChamp - AI-Powered Fitness Coach

FitChamp is an intelligent fitness application that creates personalized workout routines and nutrition plans tailored to your unique goals, body type, and lifestyle. Using advanced AI technology, it delivers custom fitness plans that adapt to your preferences and needs.

## 🚀 Features

- **Personalized Fitness Plans**: Generate custom workout routines based on your fitness level, goals, and available equipment
- **Custom Nutrition Plans**: Get tailored meal plans according to your dietary preferences (vegan, vegetarian, non-veg, keto)
- **Multiple Workout Locations**: Plans for home, gym, or outdoor workouts
- **Adaptive AI**: Uses AI to create dynamic and evolving fitness plans
- **Progress Tracking**: Tips and motivation to keep you on track
- **Export Functionality**: Download your fitness plan as a PDF
- **Responsive Design**: Works seamlessly across all devices
- **Motivational Content**: Daily inspiration and quotes to keep you motivated

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS with shadcn/ui components
- **API**: Next.js API routes
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or pnpm package manager

## 🚀 Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd ai-fitness-assistant
   ```

3. Install dependencies:

   ```bash
   # Using pnpm (recommended)
   pnpm install

   # Or using npm
   npm install
   ```

### Running the Application

1. Start the development server:

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

2. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

1. **User Profile Creation**: Enter your personal information including name, age, height, weight, fitness goals, and preferences
2. **AI Plan Generation**: The application uses AI to generate a personalized workout and nutrition plan
3. **Plan Review**: Review your custom fitness plan with detailed exercises and meal descriptions
4. **Track Progress**: Follow the plan with helpful tips and stay motivated with AI-generated quotes

### Fitness Goals Supported

- Weight Loss
- Muscle Gain
- Maintenance
- Endurance
- Flexibility

### Dietary Preferences

- Vegetarian
- Non-Vegetarian
- Vegan
- Keto

### Workout Locations

- Home workouts
- Gym-based routines
- Outdoor exercises

## 🤖 AI Integration

FitChamp uses the Pollinations.ai API to generate personalized fitness and nutrition plans. The application also includes a fallback system that generates quality plans even when the AI service is unavailable.

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
