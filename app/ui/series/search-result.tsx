import createPresignedUrl from '@/app/lib/economins';
import SearchResults from '@/app/ui/series/search-results';

export interface Element {
  name: string;
  type: string;
  source: string;
  id: string;
}

export default async function SearchResult({ id }: { id: string }) {
  const allElement: Element[] = await createPresignedUrl({ key: 'main/main' });

  return (
    <SearchResults id={id} allElement={allElement}></SearchResults>
  );
}
