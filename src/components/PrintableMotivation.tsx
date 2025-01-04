import { ScenarioFrontend } from '@/types';
import { Card } from '@/components/ui/card';

interface PrintableMotivationProps {
  scenario: ScenarioFrontend;
  currentIncome?: number;
  hideDownloadButton?: boolean;
  isPhoneBackground?: boolean;
}

export function PrintableMotivation({ scenario, currentIncome, isPhoneBackground = false }: PrintableMotivationProps) {
  const incomeGap = currentIncome ? scenario.yearlyIncome - currentIncome : scenario.yearlyIncome;
  const percentageIncrease = currentIncome ? ((incomeGap / currentIncome) * 100) : 100;

  if (isPhoneBackground) {
    return (
      <div className="bg-black text-white p-8 min-h-[2532px] flex flex-col items-center">
        <div className="flex-1" /> {/* Top spacer */}
        
        <div className="space-y-16 text-center">
          <div className="space-y-6">
            <div>
              <p className="text-3xl font-bold mb-6">You need to make</p>
              <p className="text-8xl font-bold text-green-400 mb-2">
                ${scenario.monthlyIncome.toLocaleString()}
              </p>
              <p className="text-3xl text-gray-300">per month</p>
            </div>

            <p className="text-3xl text-gray-300">
              to live the life you want in
              <br />
              {scenario.location.city}
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-gray-300 text-2xl">&quot;Every decision I make today brings me closer to this goal.&quot;</p>
              <p className="text-gray-300 text-2xl">&quot;I am capable of extraordinary growth.&quot;</p>
              <p className="text-gray-300 text-2xl">&quot;This isn&apos;t just a dream - it&apos;s my future reality.&quot;</p>
            </div>
            {percentageIncrease > 200 ? (
              <p className="font-medium text-orange-500 text-3xl">
                &quot;Yes, I need to triple my income. And yes, I WILL do it. 🔥&quot;
              </p>
            ) : (
              <p className="font-medium text-green-500 text-3xl">
                &quot;I&apos;m on my way. Every day counts. 💪&quot;
              </p>
            )}
          </div>
        </div>

        <div className="flex-1" /> {/* Bottom spacer */}
      </div>
    );
  }

  return (
    <div className="bg-white w-[8.5in] h-[11in] p-[0.5in] mx-auto">
      <div className="flex items-center justify-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-black">My Financial North Star</h2>
          <img
            src="/logo.png"
            alt="My Financial Future"
            className="w-8 h-8 object-contain rounded-full"
          />
      </div>

      <div className="space-y-6">
        <Card className="p-6 border-2 bg-white">
          <h3 className="text-xl font-semibold mb-4 text-black">The Life I&apos;m Building</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="font-medium text-gray-600">Family</h4>
              <p className="text-lg text-black">
                {scenario.family.relationship === 'partnered' ? (
                  <>
                    Partnered {scenario.family.partnerIncome > 0 
                      ? `(Partner Income: $${(scenario.family.partnerIncome / 12).toLocaleString()}/month)`
                      : '(You are the only income earner)'}
                  </>
                ) : (
                  'Single'
                )}
                {scenario.family.numChildren > 0 && 
                  ` with ${scenario.family.numChildren} ${scenario.family.numChildren === 1 ? 'child' : 'children'}`}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-600">Location</h4>
              <p className="text-lg text-black">{scenario.location.city}, {scenario.location.state}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 bg-white">
          <h3 className="text-xl font-semibold mb-4 text-green-600">The Goal</h3>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Target</p>
              <p className="text-3xl font-bold text-green-600">
                ${scenario.monthlyIncome.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Yearly Target</p>
              <p className="text-3xl font-bold text-green-600">
                ${scenario.yearlyIncome.toLocaleString()}
              </p>
            </div>
          </div>
          
          {currentIncome && (
            <div className="mt-6 p-4 border-2 rounded-lg">
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Current Income</p>
                  <p className="text-xl font-semibold text-black">${currentIncome.toLocaleString()}/year</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Growth Needed</p>
                  <p className="text-xl font-semibold text-black">{percentageIncrease.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        <div className="text-center space-y-4 mt-8">
          <p className="font-semibold text-lg text-black">Your Daily Reminder:</p>
          <div className="space-y-2">
            <p className="text-gray-600">&quot;Every decision I make today brings me closer to this goal.&quot;</p>
            <p className="text-gray-600">&quot;I am capable of extraordinary growth.&quot;</p>
            <p className="text-gray-600">&quot;This isn&apos;t just a dream - it&apos;s my future reality.&quot;</p>
            {percentageIncrease > 200 ? (
              <p className="font-medium text-orange-600 mt-4">
                &quot;Yes, I need to triple my income. And yes, I WILL do it. 🔥&quot;
              </p>
            ) : (
              <p className="font-medium text-green-600 mt-4">
                &quot;I&apos;m on my way. Every day counts. 💪&quot;
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 