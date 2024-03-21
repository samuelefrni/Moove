import React from "react";

import { IoIosMenu } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

import Image from "../assets/0x0.webp";

const Home = () => {
  return (
    <React.StrictMode>
      <div>
        <div className="border border-solid border-red-800 relative overflow-hidden min-h-[600px]">
          <nav className="flex justify-between p-5 text-white">
            <h1 className="z-10 text-2xl bg-transparent">Moove</h1>
            <IoIosMenu className="z-10 text-4xl bg-transparent" />
          </nav>
          <header className="flex flex-col items-center justify-center text-white p-5 min-h-[450px]">
            <h2 className="z-10 text-2xl bg-transparent">Go Green</h2>
            <p className="z-10 text-4xl bg-transparent text-center p-5">
              Cleaner air, Less traffic, More joy
            </p>
            <button className="z-10 text-xl bg-black text-white p-3 rounded-lg">
              Take a ride
            </button>
          </header>
          <div className="absolute w-[190%] top-[50%] left-[80%] translate-x-[-50%] translate-y-[-50%] ">
            <img src={Image} alt="Moove image landig page" className=" " />
          </div>
        </div>
        <div className="border border-solid border-black overflow-hidden min-h-[600px]">
          <header className="flex flex-col text-center h-[600px] justify-center items-center p-1">
            <h2 className="text-2xl">La nostra missione</h2>
            <p className="text-4xl font-bold p-10">
              Siamo qui per liberare le nostre città con una mobilità
              sostenibile, innovativa e alla portata di tutti!
            </p>
            <button className="text-xl bg-black rounded-lg w-[200px] p-3 text-white">
              I nostri veicoli
            </button>
          </header>
        </div>
        <div className="border border-solid border-black overflow-hidden min-h-[600px] p-5">
          <header className="flex flex-col text-center h-[600px] justify-center items-center p-1">
            <h2 className="text-2xl">Le nostre città</h2>
            <p className="text-4xl font-bold p-10">
              Amsterdam, Stoccolma, Berlino, Lisbona, Roma, Parigi, Budapest,
              Praga, Madrid, Bucharest...
            </p>
            <p className="text-2xl">
              Attualmente siamo disponibili in più di 20 città europee, ma ce ne
              sono molte altre in arrivo!
            </p>
          </header>
        </div>
        <footer className="border border-solid border-black overflow-hidden">
          <div className="flex justify-around p-5">
            <FaLinkedin className="text-2xl bg-black rounded-lg text-white p-1" />
            <FaFacebookSquare className="text-2xl bg-black rounded-lg text-white p-1" />
            <AiFillInstagram className="text-2xl bg-black rounded-lg text-white p-1" />
            <FaYoutube className="text-2xl bg-black rounded-lg text-white p-1" />
          </div>
          <ul className="grid grid-cols-2 gap-4 mt-5 p-5">
            <li className="col-span-2">2024 Moove</li>
            <li>Politica sulla privacy</li>
            <li>Condizioni d'uso</li>
            <li>Richiesta dati</li>
            <li>I miei dati</li>
            <li>Basi Giuridiche</li>
            <li>Imprint</li>
          </ul>
        </footer>
      </div>
    </React.StrictMode>
  );
};

export default Home;
