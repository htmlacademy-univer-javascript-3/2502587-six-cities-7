import { useEffect, useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import type { RootState } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchOfferDetails, fetchNearbyOffers, resetOfferState } from '../../store/slices/offers-slice';
import { fetchReviews } from '../../store/slices/reviews-slice';
import { AppRoute, AuthorizationStatus } from '../../const';
import Header from '../header/header';
import ReviewForm from '../review-form/review-form';
import ReviewsList from '../reviews-list/reviews-list';
import OffersList from '../offers-list/offers-list';
import Map from '../map/map';
import Spinner from '../spinner/spinner';

function OfferPage() : JSX.Element {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  const {
    offerDetails,
    nearbyOffers,
    isOfferLoading,
    isOfferNotFound,
    currentOfferId,
  } = useAppSelector((state: RootState) => state.offers);

  const { reviews } = useAppSelector((state) => state.reviews);
  const { authorizationStatus } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(resetOfferState());
      dispatch(fetchOfferDetails(id));
      dispatch(fetchNearbyOffers(id));
      dispatch(fetchReviews(id));
    }
  }, [id, dispatch]);

  const slicedNearbyOffers = useMemo(() => nearbyOffers.slice(0, 3), [nearbyOffers]);

  if (id !== currentOfferId || isOfferLoading) {
    return <Spinner />;
  }

  if (isOfferNotFound) {
    return <Navigate to={AppRoute.NotFound} replace />;
  }

  if (!offerDetails) {
    return <Spinner />;
  }

  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offerDetails.images.map((image: string) => (
                <div className="offer__image-wrapper" key={image}>
                  <img className="offer__image" src={image} alt="Photo studio"/>
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {offerDetails.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {offerDetails.title}
                </h1>
                <button className="offer__bookmark-button button" type="button">
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{width: `${offerDetails.rating * 20}%`}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{offerDetails.rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offerDetails.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {offerDetails.bedrooms} Bedrooms
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {offerDetails.maxAdults} adults
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{offerDetails.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {offerDetails.goods.map((good: string) => (
                    <li className="offer__inside-item" key={good}>
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                    <img className="offer__avatar user__avatar" src={offerDetails.host.avatarUrl} width="74" height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">
                    {offerDetails.host.name}
                  </span>
                  {offerDetails.host.isPro && (
                    <span className="offer__user-status">Pro</span>
                  )}
                </div>
                <div className="offer__description">
                  <p className="offer__text">
                    {offerDetails.description}
                  </p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                <ReviewsList reviews={reviews} />
                {authorizationStatus === AuthorizationStatus.Auth && <ReviewForm offerId={offerDetails.id} />}
              </section>
            </div>
          </div>
          <section className="offer__map map">
            <Map
              offers={slicedNearbyOffers}
              city={offerDetails.city}
              selectedOfferId={activeOfferId}
            />
          </section>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>

            <OffersList
              offers={slicedNearbyOffers}
              variant="near-places"
              className="near-places__list places__list"
              activeOfferId={activeOfferId}
              onCardHover={setActiveOfferId}
            />

          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
