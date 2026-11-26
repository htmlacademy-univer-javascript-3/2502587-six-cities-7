import { useCallback, memo } from 'react';
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
  const handleCardMouseEnter = useCallback((id: string) => {
    if (onCardHover) {
      onCardHover(id);
    }
  }, [onCardHover]);

  const handleCardMouseLeave = useCallback(() => {
    if (onCardHover) {
      onCardHover(null);
    }
  }, [onCardHover]);

  return (
    <div className={className}>
      {offers.map((offer) => (
        <PlaceCard
          key={offer.id}
          offer={offer}
          variant={variant}
          isActive={offer.id === activeOfferId}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        />
      ))}
    </div>
  );
}

const MemoizedOffersList = memo(OffersList);
export default MemoizedOffersList;
