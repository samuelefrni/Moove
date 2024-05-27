import React from "react";
import { useReadContract } from "wagmi";
import { RootState } from "../state/store";
import { useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import ElectricScooter from "../assets/best-electric-scooter.jpg";
import ElectricBike from "../assets/R.jpg";
import CardVehicle from "../components/CardVehicle";
import CardAuction from "../components/CardAuction";

const Vehicle = () => {
  const hamburgerMenuIsOpen = useSelector(
    (state: RootState) => state.navbar.hamburgerMenuIsOpen
  );
  const currentVehicle = useSelector(
    (state: RootState) => state.vehicle.currentVehicle
  );

  const { data: availableVehicle } = useReadContract({
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "availableVehicle",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    functionName: "availableVehicle",
    args: [BigInt(currentVehicle)],
  });

  const { data: infoVehicle } = useReadContract({
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "detailsVehicle",
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
            internalType: "uint256",
            name: "willEndAt",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    functionName: "detailsVehicle",
    args: [BigInt(currentVehicle)],
  });

  const { data: isAuctionStarted } = useReadContract({
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "isStarted",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    functionName: "isStarted",
    args: [BigInt(currentVehicle)],
  });

  const { data: auctionStatus } = useReadContract({
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "auctionStatus",
        outputs: [
          {
            internalType: "uint256",
            name: "startedAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "willEndAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "winningBid",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "ownerBid",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    functionName: "auctionStatus",
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
        {!hamburgerMenuIsOpen && (
          <div>
            <nav className="bg-black">
              <Navbar />
            </nav>
            <div>
              {Number(infoVehicle?.[3]) > 0 ? (
                infoVehicle?.[1] === "Scooter" ? (
                  <CardVehicle
                    name={`${infoVehicle?.[1]}`}
                    model={`${infoVehicle?.[2]}`}
                    image={`${ElectricScooter}`}
                    title="Ti presentiamo lo scooter elettrico Gen4"
                    firstDescription="Dotato di batterie intercambiabili, lo scooter elettrico Gen4 è il
                    nostro modello più sostenibile."
                    secondDescription="È stato realizzato per offrire una guida più confortevole, con una
                    pedana più ampia e un centro di gravità più basso che consentono il
                    pieno controllo del mezzo."
                    purchaseParagraph={`${infoVehicle?.[2]} ${infoVehicle?.[1]} ${infoVehicle?.[0]} è un veicolo di nuova generazione, che ti permetterà di muoverti con facilità in una guida veloce e confortevole.`}
                    price={Number(infoVehicle?.[3])}
                    avaible={availableVehicle || false}
                  />
                ) : (
                  <CardVehicle
                    name={`${infoVehicle?.[1]}`}
                    model={`${infoVehicle?.[2]}`}
                    image={`${ElectricBike}`}
                    title="Ti presentiamo la bicicletta elettrica Gen4"
                    firstDescription="Dotata di batterie intercambiabili, la bicicletta elettrica Gen4 è il
                  nostro modello più sostenibile."
                    secondDescription="È stata realizzato per offrire una guida più confortevole, con una
                  pedana più ampia e un centro di gravità più basso che consentono il
                  pieno controllo del mezzo."
                    purchaseParagraph={`${infoVehicle?.[2]} ${infoVehicle?.[1]} ${infoVehicle?.[0]} è un veicolo di nuova generazione, che ti permetterà di muoverti con facilità in una guida veloce e confortevole.`}
                    price={Number(infoVehicle?.[3])}
                    avaible={availableVehicle || false}
                  />
                )
              ) : infoVehicle?.[1] === "Scooter" ? (
                <CardAuction
                  name={`${infoVehicle?.[1]}`}
                  model={`${infoVehicle?.[2]}`}
                  image={`${ElectricScooter}`}
                  title="Ti presentiamo lo scooter elettrico Gen4"
                  firstDescription="Dotato di batterie intercambiabili, lo scooter elettrico Gen4 è il nostro modello più sostenibile."
                  secondDescription="È stato realizzato per offrire una guida più confortevole, con una pedana più ampia e un centro di gravità più basso che consentono il pieno controllo del mezzo."
                  winningBid={auctionStatus?.[2] || 0n}
                  isStarted={isAuctionStarted || false}
                  startedAt={auctionStatus?.[0] || 0n}
                  willEndAt={auctionStatus?.[1] || 0n}
                  ownerBid={auctionStatus?.[3] || ""}
                />
              ) : (
                <CardAuction
                  name={`${infoVehicle?.[1]}`}
                  model={`${infoVehicle?.[2]}`}
                  image={`${ElectricBike}`}
                  title="Ti presentiamo la bicicletta elettrica Gen4"
                  firstDescription="Dotata di batterie intercambiabili, la bicicletta elettrica Gen4 è il nostro modello più sostenibile."
                  secondDescription="È stata realizzato per offrire una guida più confortevole, con una pedana più ampia e un centro di gravità più basso che consentono il pieno controllo del mezzo."
                  winningBid={auctionStatus?.[2] || 0n}
                  isStarted={isAuctionStarted || false}
                  startedAt={auctionStatus?.[0] || 0n}
                  willEndAt={auctionStatus?.[1] || 0n}
                  ownerBid={auctionStatus?.[3] || ""}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </React.StrictMode>
  );
};

export default Vehicle;
