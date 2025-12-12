import { fetchDataset } from '@/app/lib/fetch-data';
import SearchResults from '@/app/ui/series/search-results';
import { Indicator } from '@/app/lib/definitions';


export default async function SearchResult({ id }: { id: string}) {
  const indicators = await fetchDataset<Indicator>(`main/main`);

  return (
    <SearchResults id={id} indicators={indicators}></SearchResults>
  );
}
