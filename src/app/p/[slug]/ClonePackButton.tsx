'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Copy, Loader2 } from 'lucide-react';

interface ClonePackButtonProps {
  slug: string;
}

export function ClonePackButton({ slug }: ClonePackButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClone = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/packs/${slug}/clone`, {
        method: 'POST',
      });

      if (res.status === 401) {
        // Not logged in, redirect to login
        router.push(`/login?redirect=/p/${slug}&action=clone`);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to clone pack');
      }

      const data = await res.json();
      // Redirect to the new collection
      router.push(`/dashboard/collections/${data.collection.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to clone pack');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClone} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Copy className="h-4 w-4 mr-2" />
      )}
      Clone to My Collections
    </Button>
  );
}
