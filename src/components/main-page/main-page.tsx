import { useState, useCallback } from 'react';
import Header from '../header/header';
import OffersList from '../offers-list/offers-list';
import Map from '../map/map';
import CitiesList from '../cities-list/cities-list';
import SortingOptions from '../sorting-options/sorting-options';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { changeCity, selectSortedOffers } from '../../store/slices/offers-slice';
import { CITIES } from '../../const';
import type { City } from '../../types';

function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const { city } = useAppSelector((state) => state.offers);

  const sortedOffers = useAppSelector(selectSortedOffers);

  const handleCityClick = useCallback((newCity: City) => {
    dispatch(changeCity(newCity));
  }, [dispatch]);

  return (
    <div className="page page--gray page--main">
      <Header />
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CitiesList
              cities={CITIES}
              currentCity={city}
              onCityClick={handleCityClick}
            />
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{sortedOffers.length} places to stay in {city.name}</b>
              <SortingOptions />
              <OffersList
                offers={sortedOffers}
                activeOfferId={activeOfferId}
                onCardHover={setActiveOfferId}
              />
            </section>
            <div className="cities__right-section">
              <Map
                offers={sortedOffers}
                city={city}
                selectedOfferId={activeOfferId}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
