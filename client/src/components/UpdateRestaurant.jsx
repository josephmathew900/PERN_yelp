import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import RestaurantFinder from "../apis/RestaurantFinder";

function UpdateRestaurant() {
  const { id } = useParams();
  const history = useHistory();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await RestaurantFinder.put(`/${id}`, {
        name,
        location,
        price_range: priceRange,
      });
      history.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RestaurantFinder.get(`/${id}`);
        setName(response.data.data.restaurant.name);
        setLocation(response.data.data.restaurant.location);
        setPriceRange(response.data.data.restaurant.price_range);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <form action="">
        <div className="mt-2 form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            className="form-control"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mt-2 form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            className="form-control"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="mt-2 form-group">
          <label htmlFor="price_range">Price Range</label>
          <input
            id="price_range"
            className=" form-control"
            type="number"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="mt-3 btn btn-warning"
          onClick={handleUpdate}
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateRestaurant;
