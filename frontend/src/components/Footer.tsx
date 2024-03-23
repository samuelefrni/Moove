import React from "react";

import { AiFillInstagram } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <React.StrictMode>
      <footer className="bg-black overflow-hidden text-white min-h-[300px]">
        <div className="flex justify-around items-center text-2xl p-5 min-h-[150px] xl:text-3xl">
          <FaLinkedin className="bg-white rounded-lg text-black p-1 cursor-pointer" />
          <FaFacebookSquare className="bg-white rounded-lg text-black p-1 cursor-pointer" />
          <AiFillInstagram className="bg-white rounded-lg text-black p-1 cursor-pointer" />
          <FaYoutube className="bg-white rounded-lg text-black p-1 cursor-pointer" />
        </div>
        <ul className="grid grid-cols-2 gap-4 p-5 text-[12px] lg:text-[14px] xl:text-[18px] xl:grid-cols-3">
          <li className="col-span-2 xl:col-span-3 text-2xl">2024 © Moove</li>
          <li className="p-2">Politica sulla privacy</li>
          <li className="p-2">Condizioni d'uso</li>
          <li className="p-2">Richiesta dati</li>
          <li className="p-2">I miei dati</li>
          <li className="p-2">Basi Giuridiche</li>
          <li className="p-2">Imprint</li>
        </ul>
      </footer>
    </React.StrictMode>
  );
};

export default Footer;
