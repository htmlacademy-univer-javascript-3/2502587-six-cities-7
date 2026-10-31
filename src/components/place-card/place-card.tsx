import { Link } from 'react-router-dom';
import { getOfferUrl } from '../../const';
import type { Offer } from '../../types';

type PlaceCardProps = {
  offer: Offer;
  variant?: 'cities' | 'near-places' | 'favorites';
  isActive?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

function PlaceCard({offer, variant = 'cities', isActive = false, onMouseEnter, onMouseLeave,}: PlaceCardProps) : JSX.Element {
  const {id, title, type, price, isPremium, isFavorite, rating, previewImage} = offer;
  const offerUrl = getOfferUrl(id);

  const cardClass = `${variant}__card place-card`;
  const imageWrapperClass = `${variant}__image-wrapper place-card__image-wrapper`;
  const imageWidth = variant === 'favorites' ? 150 : 260;
  const imageHeight = variant === 'favorites' ? 110 : 200;

  return (
    <article
      className={`${cardClass} ${isActive ? 'place-card--active' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className={imageWrapperClass}>
        <Link to={offerUrl}>
          <img className="place-card__image" src={previewImage} width={imageWidth} height={imageHeight}
            alt="Place image"
          />
        </Link>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button className={`place-card__bookmark-button button ${isFavorite ? 'place-card__bookmark-button--active' : ''}`} type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">{isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${rating * 20}%` }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={offerUrl}>{title}</Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

export default PlaceCard;
