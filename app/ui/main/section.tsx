import { ReactNode } from "react";

export default function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="
      relative
      space-y-4
      rounded-2xl
      bg-gray-50
      px-4 py-6
      ring-1 ring-gray-200
      mt-10 sm:mt-12 md:mt-14
    ">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
}
