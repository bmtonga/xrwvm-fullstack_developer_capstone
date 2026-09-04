import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0, curr_url.indexOf("postreview"));
  let params = useParams();
  let id = params.id;
  let dealer_url = root_url + `djangoapp/dealer/${id}`;
  let review_url = root_url + `djangoapp/add_review`;
  let carmodels_url = root_url + `djangoapp/get_cars`;

  const postreview = async () => {
    let firstname = sessionStorage.getItem("firstname");
    let lastname = sessionStorage.getItem("lastname");
    let username = sessionStorage.getItem("username");

    let name = `${firstname} ${lastname}`;
    if (!firstname || firstname === "null" || !lastname || lastname === "null") {
      name = username || "Anonymous User";
    }

    if (!model || review === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split.slice(1).join(" ");

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": parseInt(id, 10),
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    });

    const res = await fetch(review_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: jsoninput,
    });

    const json = await res.json();
    if (json.status === 200) {
      window.location.href = window.location.origin + "/dealer/" + id + "/";
    } else {
      alert("Failed to post review: " + (json.message || "Unauthorized"));
    }
  };

  const get_dealer = async () => {
    const res = await fetch(dealer_url, { method: "GET" });
    const retobj = await res.json();

    if (retobj.status === 200 && retobj.dealer) {
      let dealerobjs = Array.from(retobj.dealer);
      if (dealerobjs.length > 0) {
        setDealer(dealerobjs[0]);
      }
    }
  };

  const get_cars = async () => {
    const res = await fetch(carmodels_url, { method: "GET" });
    const retobj = await res.json();

    if (retobj.CarModels) {
      let carmodelsarr = Array.from(retobj.CarModels);
      setCarmodels(carmodelsarr);
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="post-review-page">
      <Header />
      <main className="post-review-content">
        <header className="post-review-heading">
          <p className="eyebrow">Share your experience</p>
          <h1>Review {dealer.full_name || "this dealership"}</h1>
          <p>Tell future customers about your visit and the vehicle you purchased.</p>
        </header>

        <form className="review-form" onSubmit={(event) => { event.preventDefault(); postreview(); }}>
          <div className="review-field review-field-wide">
            <label htmlFor="review">Your review</label>
            <textarea
              id="review"
              rows="7"
              placeholder="What stood out about your experience?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="review-form-grid">
            <div className="review-field">
              <label htmlFor="purchase-date">Purchase date</label>
              <input id="purchase-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>

            <div className="review-field">
              <label htmlFor="cars">Car make and model</label>
              <select name="cars" id="cars" value={model} onChange={(e) => setModel(e.target.value)} required>
                <option value="" disabled>Choose a vehicle</option>
                {carmodels.map((carmodel, index) => (
                  <option key={index} value={carmodel.CarMake + " " + carmodel.CarModel}>
                    {carmodel.CarMake} {carmodel.CarModel}
                  </option>
                ))}
              </select>
            </div>

            <div className="review-field">
              <label htmlFor="car-year">Car year</label>
              <input id="car-year" type="number" value={year} onChange={(e) => setYear(e.target.value)} max={2026} min={2015} placeholder="2024" required />
            </div>
          </div>

          <button className="postreview" type="submit">Post review</button>
        </form>
      </main>
    </div>
  );
};

export default PostReview;