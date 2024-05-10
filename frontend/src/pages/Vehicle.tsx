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
  const contractAddress = "0x6E255909129930283806e40ca7Bd798678338247";

  const hamburgerMenuIsOpen = useSelector(
    (state: RootState) => state.navbar.hamburgerMenuIsOpen
  );
  const currentVehicle = useSelector(
    (state: RootState) => state.vehicle.currentVehicle
  );

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

  const { data: isAuctionStarted } = useReadContract({
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_idVehicle",
            type: "uint256",
          },
        ],
        name: "isAuctionStarted",
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
    address: contractAddress,
    functionName: "isAuctionStarted",
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
    address: contractAddress,
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
                    price={`Price: ${Number(infoVehicle?.[3])} wei`}
                    avaible={infoVehicle?.[4]}
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
                    price={`Price: ${Number(infoVehicle?.[3])} wei`}
                    avaible={infoVehicle?.[4] || false}
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
