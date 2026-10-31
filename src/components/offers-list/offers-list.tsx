import PlaceCard from '../place-card/place-card';
import type { Offer } from '../../types';

type OffersListProps = {
  offers: Offer[];
  variant?: 'cities' | 'near-places' | 'favorites';
  className?: string;
  activeOfferId?: string | null;
  onCardHover?: (id: string | null) => void;
};

function OffersList({
  offers,
  variant = 'cities',
  className = 'cities__places-list places__list tabs__content',
  activeOfferId,
  onCardHover
}: OffersListProps): JSX.Element {
  return (
    <div className={className}>
      {offers.map((offer) => (
        <PlaceCard
          key={offer.id}
          offer={offer}
          variant={variant}
          isActive={offer.id === activeOfferId}
          onMouseEnter={() => onCardHover?.(offer.id)}
          onMouseLeave={() => onCardHover?.(null)}
        />
      ))}
    </div>
  );
}

export default OffersList;
