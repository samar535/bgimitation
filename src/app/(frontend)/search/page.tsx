import { Suspense } from 'react';
import SearchContent from './SearchContent';  

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Searching...</div>}>
      <SearchContent />
    </Suspense>
  );
}