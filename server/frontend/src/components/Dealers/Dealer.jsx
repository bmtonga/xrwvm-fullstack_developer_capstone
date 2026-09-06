import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faFaceMeh, faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import "./Dealers.css";
import "../assets/style.css";
import review_icon from "../assets/reviewbutton.png"
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>)

  let params = useParams();
  let id = params.id;
  let dealer_url = `/djangoapp/dealer/${id}`;
  let reviews_url = `/djangoapp/reviews/dealer/${id}`;
  let post_review = `/postreview/${id}/`;

  const sentimentMeta = {
    positive: {
      icon: faFaceSmile,
      label: 'Positive',
      className: 'sentiment-positive'
    },
    neutral: {
      icon: faFaceMeh,
      label: 'Neutral',
      className: 'sentiment-neutral'
    },
    negative: {
      icon: faFaceFrown,
      label: 'Negative',
      className: 'sentiment-negative'
    }
  };
  
  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url, { method: "GET" });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const retobj = await res.json();
      if (retobj.status !== 200 || !Array.isArray(retobj.dealer)) throw new Error(retobj.message || "Dealer unavailable");
      setDealer(retobj.dealer[0] || {});
    } catch (error) {
      console.error("Error fetching dealer:", error);
    }
  }

  const get_reviews = async () => {
    try {
      const res = await fetch(reviews_url, { method: "GET" });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const retobj = await res.json();
      if (retobj.status === 200 && Array.isArray(retobj.reviews)) {
      if (retobj.reviews.length > 0) {
        setReviews(retobj.reviews)
      } else {
        setUnreviewed(true);
      }
      } else throw new Error(retobj.message || "Reviews unavailable");
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setUnreviewed(true);
    }
  }

  const sentimentInfo = (sentiment) => {
    const normalized = (sentiment || '').toLowerCase();
    return sentimentMeta[normalized] || sentimentMeta.neutral;
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
    if (sessionStorage.getItem("username")) {
      setPostReview(<a href={post_review}><img src={review_icon} style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }} alt='Post Review' /></a>)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <h1>{dealer.full_name}{postReview}</h1>
        <h4>{dealer['city']},{dealer['address']}, Zip - {dealer['zip']}, {dealer['state']} </h4>
      </div>
      <div className="reviews_panel">
        {reviews.length === 0 && unreviewed === false ? (
          <span>Loading Reviews....</span>
        ) : unreviewed === true ? (
          <div className="reviews-empty">No reviews yet!</div>
        ) : (
          reviews.map((review, index) => {
            const meta = sentimentInfo(review.sentiment);
            return (
              <article key={index} className='review_panel'>
                <div className='review-header'>
                  <span className='review-badge'>Review</span>
                  <span className={`sentiment-pill ${meta.className}`}>
                    <FontAwesomeIcon icon={meta.icon} />
                    <span>{meta.label}</span>
                  </span>
                </div>
                <div className='review'>{review.review}</div>
                <div className="reviewer">{review.name} · {review.car_make} {review.car_model} {review.car_year}</div>
              </article>
            )
          })
        )}
      </div>  
    </div>
  )
}

export default Dealer;