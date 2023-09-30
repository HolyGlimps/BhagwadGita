import React from "react";
import Navbar from './navbar';
import '../index.css'

const Home = () => {
  return (
    <div className="App">
      <Navbar />

      <header className="App-header">
        <h1 className="text-3xl font-bold">Welcome to HolyGlimps!</h1>
      </header>
    </div>
  );
};

export default Home