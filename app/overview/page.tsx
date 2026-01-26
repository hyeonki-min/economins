import { loadIndicatorSections } from '@/app/lib/services/indicator.service';
import Section from '@/app/ui/main/section';
import IndicatorCard from '@/app/ui/main/indicator-card';


export default async function Page() {
  
  const sections = await loadIndicatorSections();
  
  return (
    <div>
      <div>
        {sections
          .map(section => (
          <Section
            key={section.id}
            title={section.title}
            description={section.description}
          >
            {section.cards.map(card => (
              <IndicatorCard
                key={card.id}
                title={card.title}
                description={card.description}
                indicators={card.indicators}
                href={card.href}
              />
            ))}
          </Section>
        ))}
      </div>
    </div>
  );
}
