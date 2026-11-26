import { memo } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { AppRoute } from '../../const';
import type { City } from '../../types';

type CitiesListProps = {
  cities: City[];
  currentCity: City;
  onCityClick: (city: City) => void;
};

function CitiesList({ cities, currentCity, onCityClick }: CitiesListProps): JSX.Element {
  return (
    <ul className="locations__list tabs__list">
      {cities.map((city) => (
        <li className="locations__item" key={city.name}>
          <Link
            className={classNames('locations__item-link tabs__item', {
              'tabs__item--active': city.name === currentCity.name,
            })}
            to={AppRoute.Main}
            onClick={() => onCityClick(city)}
          >
            <span>{city.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

const MemoizedCitiesList = memo(CitiesList);
export default MemoizedCitiesList;
