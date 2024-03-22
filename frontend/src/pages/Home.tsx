import React, { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Footer from "../components/Footer";

import ImageLandingPage from "../assets/0x0.webp";
import ImageMission from "../assets/5fcfe0b8f3d03a879fe49d11_timur-romanov-osNaWvJ1D1E-unsplash.jpg";
import ImageCity from "../assets/mapV2.svg";

const Home = () => {
  const account = useAccount();
  const { connect } = useConnect();

  const [hamburgerMenuIsOpen, setHamburgerMenuIsOpen] = useState(false);

  return (
    <React.StrictMode>
      {account.status == "disconnected" && !hamburgerMenuIsOpen && (
        <div>
          <div className="relative overflow-hidden min-h-[600px]">
            <Navbar
              hamburgerMenuIsOpen={hamburgerMenuIsOpen}
              setHamburgerMenuIsOpen={setHamburgerMenuIsOpen}
            />
            <header className="flex flex-col items-center justify-center text-white p-5 min-h-[400px]">
              <p className="z-10 text-4xl bg-transparent font-bold text-center p-5 xl:text-6xl">
                Cleaner air, Less traffic, More joy
              </p>
              <button
                className="z-10 text-xl bg-red-600 text-white p-3 rounded-lg xl:text-2xl"
                onClick={() => connect({ connector: injected() })}
              >
                Take a ride
              </button>
            </header>
            <div className="bg-gradient-to-b from-black to-gray-500 absolute w-[240%] top-[50%] left-[90%] translate-x-[-50%] translate-y-[-50%] lg:w-[200%] lg:left-[80%] lg:top-[30%] xl:w-[100%] xl:left-[50%] xl:top-[30%]">
              <img
                src={ImageLandingPage}
                alt="Moove image landig page"
                className="opacity-80 blur-[3px] lg:w-[100%]"
              />
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[600px]">
            <header className="flex flex-col text-center h-[600px] justify-center items-center p-1 text-white">
              <h2 className="text-2xl z-10 underline text-white bg-transparent">
                La nostra missione
              </h2>
              <p className="text-4xl font-bold p-10 z-10 bg-transparent xl:w-[800px]">
                Siamo qui per liberare le nostre città con una mobilità
                sostenibile, innovativa e alla portata di tutti!
              </p>
              <button className="text-xl bg-red-600 rounded-lg w-[200px] p-3 text-white z-10 xl:text-2xl">
                I nostri veicoli
              </button>
            </header>
            <div className="bg-gray-800 absolute w-[240%] top-[50%] left-[20%] translate-x-[-50%] translate-y-[-50%] lg:w-[150%] lg:left-[50%] xl:w-[100%]">
              <img
                src={ImageMission}
                alt="Moove mission"
                className="blur-[5px] grayscale-[20%] opacity-80"
              />
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[600px] p-5 bg-blue-400">
            <header className="flex flex-col text-center h-[400px] justify-center items-center p-1 bg-transparent text-white xl:p-10 xl:h-[600px]">
              <h2 className="text-2xl bg-transparent underline z-10 xl:mr-auto xl:p-5">
                Le nostre città
              </h2>
              <p className="text-4xl font-bold p-10 bg-transparent z-10 xl:mr-auto xl:text-start xl:p-5 xl:w-[300px]">
                Bruxelles, Roma, Londra, Varsavia, Parigi, Tel Aviv, Madrid...
              </p>
              <p className="text-2xl bg-transparent z-10 xl:mr-auto xl:w-[300px] xl:p-5 xl:text-start">
                Attualmente in più di 20 città europee, ma ce ne sono molte
                altre in arrivo!
              </p>
            </header>
            <div className="absolute w-[300%] top-[65%] left-[150%] translate-x-[-50%] translate-y-[-50%] bg-transparent lg:w-[250%] lg:top-[40%] lg:left-[130%] xl:w-[180%] xl:left-[120%] xl:top-[20%]">
              <img
                src={ImageCity}
                alt="Moove city"
                className="bg-transparent"
              />
            </div>
          </div>
          <Footer />
        </div>
      )}
      {account.status == "connected" ||
        (hamburgerMenuIsOpen && (
          <HamburgerMenu
            hamburgerMenuIsOpen={hamburgerMenuIsOpen}
            setHamburgerMenuIsOpen={setHamburgerMenuIsOpen}
          />
        ))}
    </React.StrictMode>
  );
};

export default Home;
