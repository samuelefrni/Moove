import React from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { abi } from "../artifacts/contracts/VehicleAuctions.sol/VehicleAuctions.json";
import { useSelector } from "react-redux";

import FAQ from "./FAQ";
import { ICardVehicle } from "../interface";
import { RootState } from "../state/store";

const CardVehicle: React.FC<ICardVehicle> = ({
  name,
  model,
  image,
  title,
  firstDescription,
  secondDescription,
  purchaseParagraph,
  price,
  avaible,
}) => {
  const account = useAccount();
  const { writeContract } = useWriteContract();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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

  const purchaseVehicle = (idVehicle: number) => {
    writeContract({
      abi,
      address: contractAddress,
      account: account.address,
      functionName: "buyNFTVehicle",
      args: [idVehicle],
      value: infoVehicle?.[3],
      nonce: 2,
    });
  };

  return (
    <React.StrictMode>
      <div>
        <div className="relative overflow-hidden h-[400px]">
          <div className="flex text-white font-[600] text-[50px] h-[400px] p-5 items-end">
            <span className="z-10">{`${model} ${name}`}</span>
          </div>
          <div className="bg-black absolute w-[180%] top-[40%] left-[90%] translate-x-[-50%] translate-y-[-50%]">
            <img src={image} alt="Bike scooter" className="opacity-60" />
          </div>
        </div>
        <div>
          <p className="font-[600] flex justify-center p-5 text-2xl">{title}</p>
          <p className="flex justify-center p-5 text-justify">
            {firstDescription}
          </p>
          <p className="flex justify-center p-5 text-justify">
            {secondDescription}
          </p>
          <div className="bg-[#00DC00] text-white text-center">
            <p className="font-[600] p-5 text-4xl">
              Costruito per essere affidabile
            </p>
            <p className="p-5 text-xl">{purchaseParagraph}</p>
            <p className="px-5 text-xl">{price}</p>
            {avaible ? (
              <button
                className="bg-black text-white rounded-lg text-2xl px-4 py-2 m-10 w-[200px] hover:text-black hover:bg-white"
                onClick={() => purchaseVehicle(currentVehicle)}
              >
                Purchase
              </button>
            ) : (
              <button className="bg-black opacity-60 cursor-default text-white rounded-lg text-2xl px-4 py-2 m-10 w-[200px]">
                Purchase
              </button>
            )}
          </div>
          <FAQ />
        </div>
      </div>
    </React.StrictMode>
  );
};

export default CardVehicle;
