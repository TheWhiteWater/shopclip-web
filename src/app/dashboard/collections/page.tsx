'use client';

import { useEffect, useState, useCallback } from 'react';
import { CollectionCard, Collection } from '@/components/collections/CollectionCard';
import { CreateCollectionDialog } from '@/components/collections/CreateCollectionDialog';
import { FolderHeart, Loader2 } from 'lucide-react';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCollections = useCallback(async () => {
    try {
      const res = await fetch('/api/collections');
      if (!res.ok) {
        throw new Error('Failed to fetch collections');
      }
      const data = await res.json();
      setCollections(data.collections || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) {
      return;
    }

    try {
      const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to delete collection');
      }
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Collections</h1>
          <p className="text-slate-500">Organize your saved items into collections</p>
        </div>
        <CreateCollectionDialog onCreated={fetchCollections} />
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <FolderHeart className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="font-semibold text-lg mb-2">No collections yet</h3>
          <p className="text-slate-500 mb-4">
            Create your first collection to organize your saved items
          </p>
          <CreateCollectionDialog onCreated={fetchCollections} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
