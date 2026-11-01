'use client';

import { useEffect } from 'react';
import { useDataStore } from '@/lib/store';

export default function DataProvider() {
  const loadData = useDataStore(s => s.loadData);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return null;
}
