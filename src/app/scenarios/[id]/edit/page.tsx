'use client';

import { EditScenarioForm } from '@/components/EditScenarioForm';
import { useParams } from 'next/navigation';

export default function EditScenarioPage() {
  const params = useParams();
  const id = params?.id as string;
  
  return <EditScenarioForm id={id} />;
} 