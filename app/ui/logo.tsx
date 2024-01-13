import { DocumentChartBarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';

export default function EconominsLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none`}
    >
      <Link
        href="/"
        className="flex items-center self-start px-6 text-sm font-medium transition-colors md:text-base"
      >
        <DocumentChartBarIcon className="h-8 w-12 rotate-[15deg]" />
        <p className="text-[18px]">economins</p>
      </Link>
    </div>
  );
}
