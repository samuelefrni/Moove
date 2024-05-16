import React from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { abi } from "../artifacts/contracts/VehicleAuctions.sol/VehicleAuctions.json";
import { useSelector } from "react-redux";

import FAQ from "./FAQ";
import { ICardVehicle } from "../interface";
import { RootState } from "../state/store";
import { Helmet } from "react-helmet";

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

  const currentVehicle = useSelector(
    (state: RootState) => state.vehicle.currentVehicle
  );

  const { data: ownerOfContract } = useReadContract({
    abi,
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    functionName: "owner",
  });

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
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    functionName: "detailsVehicle",
    args: [BigInt(currentVehicle)],
  });

  const purchaseVehicle = (idVehicle: number) => {
    writeContract({
      abi,
      address: import.meta.env.VITE_CONTRACT_ADDRESS,
      account: account.address,
      functionName: "buyNFTVehicle",
      args: [idVehicle],
      value: infoVehicle?.[3],
      // nonce:,
    });
  };

  const expiryCheck = (idVehicle: number) => {
    writeContract(
      {
        abi,
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        account: account.address,
        functionName: "expiryCheck",
        args: [idVehicle],
        // nonce: ,
      },
      {
        onError: (e) => {
          alert(e.message);
        },
      }
    );
  };

  return (
    <React.StrictMode>
      <Helmet>
        <title>{`Moove | ${infoVehicle?.[2]} ${infoVehicle?.[1]}`}</title>
      </Helmet>
      <div>
        <div className="relative overflow-hidden h-[400px]">
          <div className="flex text-white font-[600] text-[50px] h-[400px] p-5 items-end lg:text-[60px] xl:text-[80px]">
            <span className="z-10">{`${model} ${name}`}</span>
          </div>
          <div className="bg-black absolute w-[250%] top-[30%] left-[100%] translate-x-[-50%] translate-y-[-50%] lg:w-[200%] lg:top-[0%] lg:left-[90%] xl:w-[100%] xl:top-[35%] xl:left-[50%]">
            <img src={image} alt="Scooter" className="opacity-60 xl:w-[100%]" />
          </div>
        </div>
        <div className="xl:flex xl:flex-col items-center">
          <p className="font-[600] flex justify-center p-5 text-2xl lg:text-4xl lg:p-10 xl:text-5xl">
            {title}
          </p>
          <p className="flex justify-center p-5 text-justify lg:text-2xl lg:p-10 xl:text-3xl xl:w-[900px]">
            {firstDescription}
          </p>
          <p className="flex justify-center p-5 text-justify lg:text-2xl lg:p-10 xl:text-3xl xl:w-[900px]">
            {secondDescription}
          </p>
          <div className="bg-[#00DC00] text-white items-center flex flex-col w-[100%] p-5 my-5">
            <p className="font-[600] p-5 text-4xl underline text-center xl:text-5xl">
              Costruito per essere affidabile
            </p>
            <p className="p-10 text-xl text-justify lg:text-2xl lg:w-[600px] xl:text-3xl xl:w-[900px]">
              {purchaseParagraph}
            </p>
            <p className="p-5 text-xl text-center lg:text-2xl xl:text-3xl">
              {price}
            </p>
            {avaible ? (
              <button
                className="bg-black text-white font-[600] rounded-lg text-2xl px-4 py-2 m-10 w-[200px] hover:text-black hover:bg-white xl:w-[300px] xl:px-6 xl:py-4"
                onClick={() => purchaseVehicle(currentVehicle)}
              >
                Purchase
              </button>
            ) : account.address === ownerOfContract ? (
              <button
                className="bg-black text-white font-[600] rounded-lg text-2xl px-4 py-2 m-10 w-[200px] hover:text-black hover:bg-white xl:w-[300px] xl:px-6 xl:py-4"
                onClick={() => expiryCheck(currentVehicle)}
              >
                Restock
              </button>
            ) : (
              <button className="bg-black opacity-60 cursor-default text-white rounded-lg text-2xl px-4 py-2 m-10 w-[200px] xl:text-4xl xl:w-[300px] xl:px-8 xl:py-4">
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
