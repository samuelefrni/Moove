import React from "react";
import { useAccount } from "wagmi";

import { IoIosMenu } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Home = () => {
  const account = useAccount();

  return (
    <React.StrictMode>
      <div className="border border-solid border-red-800 py-2">
        {account.status == "disconnected" && (
          <div>
            <nav className="border border-solid border-black flex justify-between px-2">
              <h1 className="text-xl">Moove</h1>
              <IoIosMenu className="text-2xl" />
            </nav>
            <div className="border border-solid border-black my-5 text-center">
              <h2 className="text-xl rounded-lg p-2 text-white font-bold">
                Go Green
                {/* GIF PERSONA IN BICICLETTA */}
              </h2>
            </div>
            <header className="my-5">
              <div className="border border-solid border-black flex flex-col text-center items-center p-3">
                <h2 className="text-xl">La nostra missione</h2>
                <p className="text-2xl font-bold p-2 mb-2">
                  Siamo qui per liberare le nostre città con una mobilità
                  sostenibile, innovativa e alla portata di tutti!
                </p>
                <button className="text-xl bg-black hover:bg-green-800 rounded-lg w-[200px] p-3 text-white">
                  I nostri veicoli
                </button>
              </div>
            </header>
            <header className="my-5">
              <div className="border border-solid border-black flex flex-col text-center items-center p-3">
                <h2 className="text-xl">Le nostre città</h2>
                <p className="text-2xl font-bold p-2 mb-2">
                  Dove puoi trovarci
                </p>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Tenetur mollitia illo vitae, eos, quibusdam accusantium
                  accusamus quod distinctio quas aliquid voluptate nostrum
                  assumenda dolores earum quo dolor? Dolor, delectus quas.
                </p>
              </div>
            </header>
            <footer className="border border-solid border-black p-2">
              <div className="border border-solid border-black flex justify-around py-2">
                <FaLinkedin className="text-2xl bg-black rounded-lg text-white p-1" />
                <FaFacebookSquare className="text-2xl bg-black rounded-lg text-white p-1" />
                <AiFillInstagram className="text-2xl bg-black rounded-lg text-white p-1" />
                <FaYoutube className="text-2xl bg-black rounded-lg text-white p-1" />
              </div>
              <ul className="grid grid-cols-2 gap-4 py-2">
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
        )}
      </div>
    </React.StrictMode>
  );
};

export default Home;
