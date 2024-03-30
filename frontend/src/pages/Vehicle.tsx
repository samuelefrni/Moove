import React from "react";
import { useReadContract } from "wagmi";
import { RootState } from "../state/store";
import { useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import ElectricScooter from "../assets/best-electric-scooter.jpg";
import ElectricBike from "../assets/2021011409531570234.jpeg";
import Footer from "../components/Footer";

const Vehicle = () => {
  const hamburgerMenuIsOpen = useSelector(
    (state: RootState) => state.navbar.hamburgerMenuIsOpen
  );
  const currentVehicle = useSelector(
    (state: RootState) => state.vehicle.currentVehicle
  );
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const { data: infoVehicle } = useReadContract({
    abi: [
      {
        type: "function",
        name: "detailsVehicle",
        stateMutability: "view",
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        outputs: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "model",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "priceVehicle",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "available",
            type: "bool",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
      },
    ],
    address: contractAddress,
    functionName: "detailsVehicle",
    args: [BigInt(currentVehicle)],
  });

  return (
    <React.StrictMode>
      <div>
        {hamburgerMenuIsOpen && (
          <div>
            <Navbar />
            <HamburgerMenu />
          </div>
        )}
        <div>
          <nav className="bg-black">
            <Navbar />
          </nav>
          <div>
            {infoVehicle?.[1] === "Scooter" ? (
              <div>
                <div className="border border-solid border-blue-600 relative overflow-hidden h-[400px]">
                  <div className="flex text-white font-[600] text-[50px] h-[400px] p-5 items-end">
                    <span className="z-10">{`${infoVehicle?.[2]} ${infoVehicle?.[1]}`}</span>
                  </div>
                  <div className="bg-black absolute w-[180%] top-[0%] left-[90%] translate-x-[-50%] translate-y-[-0%]">
                    <img
                      src={ElectricScooter}
                      alt="Bike scooter"
                      className="opacity-60"
                    />
                  </div>
                </div>
                <div className="border border-solid border-red-600">
                  <p className="font-[600] flex justify-center p-5 text-2xl">
                    Ti presentiamo lo scooter elettrico Gen4
                  </p>
                  <p className="flex justify-center p-5 text-justify">
                    Dotato di batterie intercambiabili, lo scooter elettrico
                    Gen4 è il nostro modello più sostenibile.
                  </p>
                  <p className="flex justify-center p-5 text-justify">
                    È stato realizzato per offrire una guida più confortevole,
                    con una pedana più ampia e un centro di gravità più basso
                    che consentono il pieno controllo del mezzo.
                  </p>
                  <div className="bg-[#00DC00] text-center">
                    <p className="font-[600] p-5 text-4xl">
                      {`Dettagli ${infoVehicle?.[2]} ${infoVehicle?.[1]} ${infoVehicle?.[0]}`}
                    </p>
                    <p className="p-5 text-2xl text-start">
                      Id: {Number(infoVehicle?.[0])}
                    </p>
                    <p className="p-5 text-2xl text-start">
                      Vehicle: {String(infoVehicle?.[1])}
                    </p>
                    <p className="p-5 text-2xl text-start">
                      Model: {String(infoVehicle?.[2])}
                    </p>
                    <p className="p-5 text-2xl text-start">
                      Avaible: {String(infoVehicle?.[4])}
                    </p>
                    <p className="p-5 text-2xl text-start">
                      Price: {`${Number(infoVehicle?.[3])} wei`}
                    </p>
                    <button className="bg-black text-white rounded-lg text-2xl px-4 py-2 m-10 w-[200px] hover:text-black hover:bg-white">
                      Ride it
                    </button>
                  </div>
                  <div className="">
                    <p className="font-[600] p-5 text-2xl text-center">FAQ</p>
                    <hr />
                    <p className="font-[600] p-5 text-start">
                      Come posso utilizzare un veicolo Moove?
                    </p>
                    <p className="italic px-5 py-2 text-justify">
                      Il primo passo è collegarsi al mondo Web3 attraverso
                      l'utilizzo di un wallet. Una volta collegato con il tuo
                      wallet, basterà selezionare un veicolo, acquistarlo e
                      scansionare il codice QR del veicolo per sbloccarlo.
                      Fatto!
                    </p>
                    <hr />
                    <p className="font-[600] p-5 text-start">
                      Devo indossare un casco?
                    </p>
                    <p className="italic px-5 py-2 text-justify">
                      Consigliamo sempre di indossare un casco quando si guida
                      un veicolo Moove. In alcune città è obbligatorio.
                    </p>
                    <hr />
                    <p className="font-[600] p-5 text-start">Quanto costa?</p>
                    <p className="italic px-5 py-2 text-justify">
                      Il prezzo dei diversi veicoli varia a seconda di quanto
                      l'amministrazione sceglie. Per sapere esattamente quanto
                      costa un determinato veicolo basta controllarlo nella
                      sezione dedicata al veicolo stesso.
                    </p>
                    <hr />
                    <p className="font-[600] p-5 text-start">Quanto dura?</p>
                    <p className="italic px-5 py-2 text-justify">
                      Dal momento dell'acquisto il veicolo è accessibile
                      attraverso il codice QR per le prossime 24h. Scadute
                      queste il veicolo non sarà più accessibile.
                    </p>
                  </div>
                </div>
                <Footer />
              </div>
            ) : (
              <div>
                <div className="border border-solid border-blue-600 relative overflow-hidden h-[400px]">
                  <div className="flex text-white font-[600] text-[50px] h-[400px] p-5 items-end">
                    <span className="z-10">{`${infoVehicle?.[2]} ${infoVehicle?.[1]}`}</span>
                  </div>
                  <div className="bg-black absolute w-[180%] top-[0%] left-[10%] translate-x-[-50%] translate-y-[-0%]">
                    <img
                      src={ElectricBike}
                      alt="Bike scooter"
                      className="opacity-60"
                    />
                  </div>
                </div>
                <div className="border border-solid border-red-600">
                  <p className="font-[600] flex justify-center p-5 text-2xl">
                    Ti presentiamo la bicicletta elettrica Gen4
                  </p>
                  <p className="flex justify-center p-5 text-justify">
                    Dotata di batterie intercambiabili, la bicicletta elettrica
                    Gen4 è il nostro modello più sostenibile.
                  </p>
                  <p className="flex justify-center p-5 text-justify">
                    È stato realizzato per offrire una guida più confortevole,
                    con una pedana più ampia e un centro di gravità più basso
                    che consentono il pieno controllo del mezzo.
                  </p>
                  <div className="bg-[#00DC00] text-center">
                    <p className="font-[600] p-5 text-4xl">
                      {`Dettagli ${infoVehicle?.[2]} ${infoVehicle?.[1]} ${infoVehicle?.[0]}`}
                    </p>
                    <p className="p-5 text-2xl text-start">
                      Id: {Number(infoVehicle?.[0])}
                    </p>
                    <p className="p-5 text-2xl text-start">
                      Vehicle: {String(infoVehicle?.[1])}
                    </p>
                    <p className="p-5 text-2xl text-start">
                      Model: {String(infoVehicle?.[2])}
                    </p>
                    <p className="p-5 text-2xl text-start">
                      Avaible: {String(infoVehicle?.[4])}
                    </p>
                    <p className="p-5 text-2xl text-start">
                      Price: {`${Number(infoVehicle?.[3])} wei`}
                    </p>
                    <button className="bg-black text-white rounded-lg text-2xl px-4 py-2 m-10 w-[200px] hover:text-black hover:bg-white">
                      Ride it
                    </button>
                  </div>
                  <div className="">
                    <p className="font-[600] p-5 text-2xl text-center">FAQ</p>
                    <hr />
                    <p className="font-[600] p-5 text-start">
                      Come posso utilizzare un veicolo Moove?
                    </p>
                    <p className="italic px-5 py-2 text-justify">
                      Il primo passo è collegarsi al mondo Web3 attraverso
                      l'utilizzo di un wallet. Una volta collegato con il tuo
                      wallet, basterà selezionare un veicolo, acquistarlo e
                      scansionare il codice QR del veicolo per sbloccarlo.
                      Fatto!
                    </p>
                    <hr />
                    <p className="font-[600] p-5 text-start">
                      Devo indossare un casco?
                    </p>
                    <p className="italic px-5 py-2 text-justify">
                      Consigliamo sempre di indossare un casco quando si guida
                      un veicolo Moove. In alcune città è obbligatorio.
                    </p>
                    <hr />
                    <p className="font-[600] p-5 text-start">Quanto costa?</p>
                    <p className="italic px-5 py-2 text-justify">
                      Il prezzo dei diversi veicoli varia a seconda di quanto
                      l'amministrazione sceglie. Per sapere esattamente quanto
                      costa un determinato veicolo basta controllarlo nella
                      sezione dedicata al veicolo stesso.
                    </p>
                    <hr />
                    <p className="font-[600] p-5 text-start">Quanto dura?</p>
                    <p className="italic px-5 py-2 text-justify">
                      Dal momento dell'acquisto il veicolo è accessibile
                      attraverso il codice QR per le prossime 24h. Scadute
                      queste il veicolo non sarà più accessibile.
                    </p>
                  </div>
                </div>
                <Footer />
              </div>
            )}
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default Vehicle;
