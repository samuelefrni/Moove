import React from "react";

import { AiFillInstagram } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <React.StrictMode>
      <footer className="overflow-hidden text-black min-h-[300px]">
        <div className="flex justify-around items-center text-2xl p-5 min-h-[150px] xl:text-3xl">
          <FaLinkedin className="bg-black rounded-lg text-white p-1 cursor-pointer" />
          <FaFacebookSquare className="bg-black rounded-lg text-white p-1 cursor-pointer" />
          <AiFillInstagram className="bg-black rounded-lg text-white p-1 cursor-pointer" />
          <FaYoutube className="bg-black rounded-lg text-white p-1 cursor-pointer" />
        </div>
        <ul className="grid grid-cols-2 gap-4 p-5 xl:grid-cols-3">
          <li className="col-span-2 xl:col-span-3 text-2xl">©2024 Moove</li>
          <li>Politica sulla privacy</li>
          <li>Condizioni d'uso</li>
          <li>Richiesta dati</li>
          <li>I miei dati</li>
          <li>Basi Giuridiche</li>
          <li>Imprint</li>
        </ul>
      </footer>
    </React.StrictMode>
  );
};

export default Footer;
