# My Financial Future

A sophisticated financial planning tool that helps you visualize the income needed to maintain your desired lifestyle. Built with Next.js, TypeScript, and Firebase.

## Features
- Interactive lifestyle planning wizard
- Cost of living adjustments based on location
- Family size and child expenses consideration
- Detailed monthly expense breakdowns
- Visual cash flow analysis with Sankey diagrams
- Multiple scenario comparison
- Real-time tax impact calculations

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Firebase (Auth & Firestore)
- Tailwind CSS
- shadcn/ui components
- Nivo for data visualization

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/myfinancialfuture.git
cd myfinancialfuture
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase
- Create a Firebase project
- Enable Authentication and Firestore
- Create a `.env.local` file with your Firebase config:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server
```bash
npm run dev
```

## How It Works

The app helps users answer the question: "How much do I need to earn to live my desired lifestyle?" by considering:

- **Location**: Cost of living adjustments based on city/region
- **Lifestyle**: Choose between modest, comfortable, or luxury living standards
- **Family**: Account for relationship status and number of children
- **Expenses**: Detailed breakdown of monthly costs across categories
- **Taxes**: Estimated tax impact on required income

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for your own projects.
# myfinancialfuture
