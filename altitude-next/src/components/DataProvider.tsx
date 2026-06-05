'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function DataProvider() {
  const loadData = useStore(s => s.loadData);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return null;
}
