import React from "react";
import AddRestaurant from "../components/AddRestaurant";
import Header from "../components/Header";
import RestaurantDetailPage from "./RestaurantDetailPage";

function Home() {
  return (
    <div>
      <Header />
      <AddRestaurant />
      <RestaurantDetailPage />
    </div>
  );
}

export default Home;
