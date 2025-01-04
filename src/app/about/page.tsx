import { Card } from '@/components/ui/card';
import { HeartHandshake, LightbulbIcon, Target, Wallet } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">About MyFinancialFuture</h1>
        <p className="text-muted-foreground">
          A personal story of financial awakening and the tool that emerged from it.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <p className="text-muted-foreground">
            Hi, I&apos;m Gary. Despite being in my 30s and working in tech, I&apos;ve done a pretty poor job at financial 
            planning. Like many others, I&apos;ve been living paycheck to paycheck, not really thinking about the future. 
            Sure, I had some savings, but no real plan.
          </p>
        </div>

        <div className="p-4 bg-green-950/10 border border-green-800/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <LightbulbIcon className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-semibold">The Reality Check</h2>
          </div>
          <p className="text-muted-foreground">
            Then it hit me - I want to have a family someday. As I started crunching the numbers, I realized 
            I needed to make more money than I do now to support the lifestyle I want for my future family. 
            The costs of housing, childcare, education savings, and healthcare in major cities were eye-opening. 
            This wasn&apos;t just about saving a bit more - it was about completely rethinking my income goals.
          </p>
        </div>

        <div className="p-4 bg-green-950/10 border border-green-800/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-semibold">The Solution</h2>
          </div>
          <p className="text-muted-foreground">
            I couldn&apos;t find a tool that would help me visualize these financial goals in a clear, modern way. 
            Most calculators were either too simplistic or overwhelmingly complex. I wanted something that would:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-2 text-muted-foreground">
            <li>Show exactly how much I need to earn for different lifestyles</li>
            <li>Account for location-specific costs of living</li>
            <li>Factor in family planning and partner income</li>
            <li>Present everything in a visually appealing, easy-to-understand way</li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            I also wanted something I could put on my wall as a daily reminder, 
            or set as my phone background to keep me focused on my financial goals. 
            Sometimes the best motivation is having your goals stare you in the face every day.
          </p>
        </div>

        <div className="p-4 bg-green-950/10 border border-green-800/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-semibold">The Mission</h2>
          </div>
          <p className="text-muted-foreground">
            MyFinancialFuture isn&apos;t just a calculator - it&apos;s a reality check and planning tool. Whether you&apos;re 
            like me and need a wake-up call, or you&apos;re already planning ahead, this tool helps you understand the real 
            numbers behind your lifestyle goals. It&apos;s about making informed decisions about our careers, savings, and 
            life choices.
          </p>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <HeartHandshake className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-sm text-muted-foreground italic">
            &quot;The best time to plant a tree was 20 years ago. The second best time is now.&quot; 
            This tool is my way of planting that tree - for myself and for others who want to take 
            control of their financial future.
          </p>
        </div>
      </Card>
    </div>
  );
} 