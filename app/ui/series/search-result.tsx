import createPresignedUrl from '@/app/lib/economins';
import SearchResults from '@/app/ui/series/search-results';
import { Indicator } from '@/app/lib/definitions';


export default async function SearchResult({ id }: { id: string}) {
  const indicators: Indicator[] = await createPresignedUrl({ key: 'main/main' });

  return (
    <SearchResults id={id} indicators={indicators}></SearchResults>
  );
}
