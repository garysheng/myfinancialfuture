'use client';

import { ScenarioContent } from '@/components/ScenarioContent';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  
  return <ScenarioContent id={id} />;
} 