import { useRouter } from 'next/router';
import ActionView from '@/views/monitoring/ActionView';

export default function ActionPage() {
  const router = useRouter();
  const { id } = router.query;

  // Pastikan ID sudah ter-load dari router sebelum merender view
  if (!id) return null;

  return <ActionView id={id as string} />;
}