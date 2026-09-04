import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);
  const [error, setError] = useState("");

  let dealer_url = "/djangoapp/get_dealers";
  let dealer_url_by_state = "/djangoapp/get_dealers/";

  const filterDealers = async (state) => {
    const url = dealer_url_by_state + state;
    try {
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const retobj = await res.json();
      if (retobj.status !== 200 || !Array.isArray(retobj.dealers)) {
        throw new Error(retobj.message || "Dealership data is unavailable");
      }
      setError("");
      setDealersList(retobj.dealers);
    } catch (requestError) {
      console.error("Error filtering dealers:", requestError);
      setDealersList([]);
      setError("Dealerships are temporarily unavailable.");
    }
  }

  const get_dealers = async () => {
    try {
      const res = await fetch(dealer_url, { method: "GET" });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const retobj = await res.json();
      if (retobj.status !== 200 || !Array.isArray(retobj.dealers)) {
        throw new Error(retobj.message || "Dealership data is unavailable");
      }
      const all_dealers = retobj.dealers;
      let extractedStates = [];
      all_dealers.forEach((dealer) => {
        extractedStates.push(dealer.state)
      });

      setStates(Array.from(new Set(extractedStates)))
      setDealersList(all_dealers)
      setError("");
    } catch (requestError) {
      console.error("Error fetching dealers:", requestError);
      setDealersList([]);
      setError("Dealerships are temporarily unavailable.");
    }
  }

  useEffect(() => {
    get_dealers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  

  let isLoggedIn = sessionStorage.getItem("username") != null;

  return (
    <div className="dealers-page">
      <Header />
      <main className="dealers-content">
        <div className="dealers-heading">
          <div>
            <p className="eyebrow">Find your next stop</p>
            <h1>Dealerships near you</h1>
            <p className="dealers-intro">Explore trusted dealers and discover the right place for your next vehicle.</p>
          </div>
          <label className="state-filter" htmlFor="state">
            <span>Filter by state</span>
            <select name="state" id="state" defaultValue="" onChange={(e) => filterDealers(e.target.value)}>
              <option value="" disabled hidden>Choose a state</option>
              <option value="All">All States</option>
              {states.map((state, idx) => (
                <option key={idx} value={state}>{state}</option>
              ))}
            </select>
          </label>
        </div>
        {error ? <p className="dealers-alert" role="alert">{error}</p> : null}
        <div className="dealers-table-wrap">
          <table className="dealers-table">
            <thead>
              <tr>
                <th scope="col">Dealer</th>
                <th scope="col">Location</th>
                <th scope="col">Address</th>
                <th scope="col">ZIP</th>
                {isLoggedIn ? <th scope="col" aria-label="Review dealer">Action</th> : null}
              </tr>
            </thead>
            <tbody>
              {dealersList.map((dealer) => (
                <tr key={dealer['id']}>
                  <td data-label="Dealer"><span className="dealer-id">#{dealer['id']}</span><a className="dealer-link" href={'/dealer/' + dealer['id'] + '/'}>{dealer['full_name']}</a></td>
                  <td data-label="Location">{dealer['city']}<span className="state-name">{dealer['state']}</span></td>
                  <td data-label="Address">{dealer['address']}</td>
                  <td data-label="ZIP">{dealer['zip']}</td>
                  {isLoggedIn ? (
                    <td data-label="Action"><a className="review-link" href={`/postreview/${dealer['id']}/`}><FontAwesomeIcon icon={faPenToSquare} aria-hidden="true" /> <span>Review</span></a></td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Dealers;