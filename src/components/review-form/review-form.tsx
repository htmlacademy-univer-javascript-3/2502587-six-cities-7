import { useState, type ChangeEvent, Fragment, type FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { postReview } from '../../store/slices/reviews-slice';
import type { Rating } from '../../types';
import { RATING_OPTIONS } from '../../const';

type ReviewFormProps = {
  offerId: string;
};

function ReviewForm({ offerId }: ReviewFormProps): JSX.Element {
  const dispatch = useAppDispatch();
  const { isReviewsLoading: isPosting } = useAppSelector((state) => state.reviews);
  const { reviewError } = useAppSelector((state) => state.reviews);

  const [rating, setRating] = useState<Rating | 0>(0);
  const [review, setReview] = useState('');

  const handleRatingChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setRating(Number(evt.target.value) as Rating);
  };

  const handleReviewChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setReview(evt.target.value);
  };

  const isValid = rating > 0 && review.trim().length >= 50 && review.trim().length <= 300;

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (isValid) {
      dispatch(postReview({ offerId, comment: review.trim(), rating }))
        .unwrap()
        .then(() => {
          setRating(0);
          setReview('');
        })
        .catch(() => {
        });
    }
  };

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>

      <div className="reviews__rating-form form__rating">
        {RATING_OPTIONS.map(({ value, title }) => (
          <Fragment key={value}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={value}
              id={`${value}-stars`}
              type="radio"
              checked={rating === value}
              onChange={handleRatingChange}
            />
            <label
              htmlFor={`${value}-stars`}
              className="reviews__rating-label form__rating-label"
              title={title}
            >
              <svg className="form__star-image" width="37" height="33">
                <use href="#icon-star"></use>
              </svg>
            </label>
          </Fragment>
        ))}
      </div>

      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={review}
        onChange={handleReviewChange}
      >
      </textarea>

      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe your stay
          with at least <b className="reviews__text-amount">50 characters</b>.
        </p>

        {reviewError && (
          <p className="reviews__error">
            {reviewError}
          </p>
        )}

        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={!isValid || isPosting}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
