import React, { useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import RestaurantFinder from "../apis/RestaurantFinder";

function AddReview() {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();

  const [name, setName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("Rating");

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await RestaurantFinder.post(`/${id}/addReview`, {
        name,
        review: reviewText,
        rating,
      });
      history.push("/");
      history.push(location.pathname);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mb-2">
      <form action="">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group mt-4 mb-4">
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              className="custom-select"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option disabled>Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="review">Review</label>
          <textarea
            id="review"
            className="form-control"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </div>
        <button onClick={handleSubmitReview} className="btn btn-primary mt-2">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddReview;
