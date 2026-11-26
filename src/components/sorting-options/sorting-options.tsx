import { useState, memo } from 'react';
import classNames from 'classnames';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { changeSortType } from '../../store/slices/offers-slice';
import { SORT_TYPES } from '../../const';
import type { SortType } from '../../types';

function SortingOptions(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const currentSort = useAppSelector((state) => state.offers.sortType) ;

  const handleSortClick = (type: SortType) => {
    dispatch(changeSortType(type));
    setIsOpen(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
      >
        {SORT_TYPES[currentSort]}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use href="#icon-arrow-select"></use>
        </svg>
      </span>

      <ul
        className={classNames('places__options places__options--custom', {
          'places__options--opened': isOpen,
        })}
      >
        {(Object.keys(SORT_TYPES) as SortType[]).map((type) => (
          <li
            key={type}
            className={classNames('places__option', {
              'places__option--active': type === currentSort,
            })}
            tabIndex={0}
            onClick={() => handleSortClick(type)}
          >
            {SORT_TYPES[type]}
          </li>
        ))}
      </ul>
    </form>
  );
}

const MemoizedSortingOptions = memo(SortingOptions);
export default MemoizedSortingOptions;
