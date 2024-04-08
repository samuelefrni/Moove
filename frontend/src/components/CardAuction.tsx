import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { abi } from "../artifacts/contracts/VehicleAuctions.sol/VehicleAuctions.json";
import { formatEther, parseEther } from "viem";
import { ICardAuction } from "../interface";

import FAQ from "./FAQ";

const CardAuction: React.FC<ICardAuction> = ({
  name,
  model,
  image,
  title,
  firstDescription,
  secondDescription,
  isStarted,
  winningBid,
  ownerBid,
  startedAt,
  willEndAt,
}) => {
  const account = useAccount();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const { writeContract } = useWriteContract();

  const [bid, setBid] = useState<string>("");

  const currentVehicle = useSelector(
    (state: RootState) => state.vehicle.currentVehicle
  );

  const { data: ownerOfContract } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "owner",
  });

  const { data: currentTimestamp } = useReadContract({
    abi: [
      {
        inputs: [],
        name: "getCurrentTimestamp",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    address: contractAddress,
    functionName: "getCurrentTimestamp",
  });

  const { data: hasWithdrawhed } = useReadContract({
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_idVehicle",
            type: "uint256",
          },
        ],
        name: "hasWithdrawhed",
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
    functionName: "hasWithdrawhed",
    args: [BigInt(currentVehicle)],
  });

  const { data: hasRecoveredFunds } = useReadContract({
    abi: [
      {
        inputs: [],
        name: "hasRecoveredFunds",
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
    functionName: "hasRecoveredFunds",
  });

  const startAuction = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    writeContract({
      abi,
      address: contractAddress,
      account: account.address,
      functionName: "startAuction",
      args: [currentVehicle],
      nonce: 3,
    });
  };

  const makeOffer = (idVehicle: number, valueInEther: string) => {
    if (bid != "") {
      writeContract(
        {
          abi,
          address: contractAddress,
          account: account.address,
          functionName: "participateAuction",
          args: [BigInt(idVehicle)],
          value: parseEther(valueInEther),
          nonce: 0,
        },
        {
          onError: (e) => {
            alert(e.message);
          },
        }
      );
    }
  };

  const withdrawNFT = () => {
    writeContract(
      {
        abi,
        address: contractAddress,
        account: account.address,
        functionName: "withdrawNFT",
        args: [currentVehicle],
        nonce: 1,
      },
      {
        onError: (e) => {
          alert(e.message);
        },
      }
    );
  };

  const recoverFunds = () => {
    writeContract(
      {
        abi,
        address: contractAddress,
        account: account.address,
        functionName: "recoverFunds",
        args: [currentVehicle],
        nonce: 1,
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
        <form
          onSubmit={startAuction}
          className="bg-black text-center text-white"
        >
          {isStarted ? (
            currentTimestamp && currentTimestamp < willEndAt ? (
              <div className="flex flex-col items-center">
                <p className="font-[600] p-5 text-4xl">Auction Started</p>
                <p className="p-3 text-xl">{`Started at: ${startedAt}`}</p>
                <p className="p-3 text-xl">{`Current: ${currentTimestamp}`}</p>
                <p className="p-3 text-xl">{`Will end: ${willEndAt}`}</p>
                <div className="flex m-3">
                  <p className="p-3 text-xl font-[600]">{`Winning Bid: ${formatEther(
                    winningBid
                  )} ETH`}</p>
                  <p className="p-3 text-xl font-[600]">{`Owner: ${ownerBid?.slice(
                    0,
                    6
                  )}...`}</p>
                </div>
                <input
                  className="p-5 text-xl placeholder:text-xl rounded-lg text-black"
                  type="text"
                  placeholder="Parse value in ETH"
                  value={bid}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBid(e.target.value)
                  }
                />
                <button
                  className="bg-black text-white rounded-lg text-2xl px-4 py-2 m-10 w-[200px] hover:text-black hover:bg-white"
                  type="button"
                  onClick={() => makeOffer(currentVehicle, bid)}
                >
                  Make Bid
                </button>
              </div>
            ) : account.address === ownerBid ? (
              hasWithdrawhed === true ? (
                <div>
                  <button className="bg-white opacity-60 cursor-default text-black rounded-lg text-2xl px-4 py-2 m-10 w-[200px]">
                    Withdraw
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    className="bg-black text-white rounded-lg text-2xl px-4 py-2 m-10 w-[200px] hover:text-black hover:bg-white"
                    type="button"
                    onClick={() => withdrawNFT()}
                  >
                    Withdraw
                  </button>
                </div>
              )
            ) : hasRecoveredFunds === true ? (
              <div>
                <button className="bg-white opacity-60 cursor-default text-black rounded-lg text-2xl px-4 py-2 m-10 w-[200px]">
                  Recover Funds
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="bg-black text-white rounded-lg text-2xl px-4 py-2 m-10 w-[200px] hover:text-black hover:bg-white"
                  type="button"
                  onClick={() => recoverFunds()}
                >
                  Recover Funds
                </button>
              </div>
            )
          ) : account.address === ownerOfContract ? (
            <div className="p-10">
              <button
                className="bg-black text-white rounded-lg font-[600] m-5 p-5 text-4xl hover:text-black hover:bg-white"
                type="submit"
              >
                Start Auction
              </button>
            </div>
          ) : (
            <div className="p-10">
              <p className="font-[600] p-5 text-4xl">Auction isn't started</p>
            </div>
          )}
        </form>
        <FAQ />
      </div>
    </React.StrictMode>
  );
};

export default CardAuction;
