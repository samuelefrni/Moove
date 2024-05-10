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
  const contractAddress = "0x6E255909129930283806e40ca7Bd798678338247";
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
      // nonce: ,
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
          // nonce: ,
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
        // nonce: ,
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
        // nonce: ,
      },
      {
        onError: (e) => {
          alert(e.message);
        },
      }
    );
  };

  const expiryCheckAuction = (idVehicle: number) => {
    writeContract(
      {
        abi,
        address: contractAddress,
        account: account.address,
        functionName: "expiryCheckAuction",
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
      <div className="relative overflow-hidden h-[400px]">
        <div className="flex text-white font-[600] text-[50px] h-[400px] p-5 items-end lg:text-[60px] xl:text-[80px]">
          <span className="z-10">{`${model} ${name}`}</span>
        </div>
        <div className="bg-black absolute w-[250%] top-[30%] left-[100%] translate-x-[-50%] translate-y-[-50%] lg:w-[200%] lg:top-[0%] lg:left-[90%] xl:w-[100%] xl:top-[60%] xl:left-[50%]">
          <img src={image} alt="Bike" className="opacity-60 xl:w-[100%]" />
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
        <form
          onSubmit={startAuction}
          className="bg-black text-white items-center flex flex-col w-[100%] p-10"
        >
          {isStarted ? (
            currentTimestamp && currentTimestamp < willEndAt ? (
              <div className="flex flex-col items-center">
                <p className="font-[600] flex justify-center p-5 text-2xl lg:text-4xl lg:p-10 xl:text-5xl">
                  Auction Started
                </p>
                <p className="flex justify-center text-xl p-5 text-justify lg:text-2xl xl:p-10 xl:text-3xl">{`Started at: ${startedAt}`}</p>
                {/* <p className="flex justify-center text-xl p-5 text-justify lg:text-2xl xl:p-10 xl:text-4xl">{`Current: ${currentTimestamp}`}</p> */}
                <p className="flex justify-center text-xl p-5 text-justify lg:text-2xl xl:p-10 xl:text-3xl">{`Will end: ${willEndAt}`}</p>
                <div className="flex m-5">
                  <p className="flex justify-center p-5 text-justify lg:text-2xl xl:text-3xl">{`Winning Bid: ${formatEther(
                    winningBid
                  )} ETH`}</p>
                  <p className="pflex justify-center p-5 text-justify lg:text-2xl xl:text-3xl">{`Owner: ${ownerBid?.slice(
                    0,
                    6
                  )}...`}</p>
                </div>
                <input
                  className="p-2 rounded-lg text-center text-black lg:p-5 lg:placeholder:text-xl xl:placeholder:text-2xl xl:w-[400px]"
                  type="text"
                  placeholder="Parse value in ETH"
                  value={bid}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBid(e.target.value)
                  }
                />
                <button
                  className="bg-white text-black rounded-lg text-2xl px-4 py-2 m-10 w-[200px] hover:text-white hover:bg-black xl:text-3xl xl:px-8 xl:py-4"
                  type="button"
                  onClick={() => makeOffer(currentVehicle, bid)}
                >
                  Make Bid
                </button>
              </div>
            ) : account.address === ownerBid ? (
              hasWithdrawhed === true ? (
                <div>
                  <button className="bg-white opacity-60 cursor-default text-black rounded-lg text-2xl px-4 py-2 m-10 w-[200px] xl:text-4xl">
                    Withdraw
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    className="bg-black text-white rounded-lg text-2xl px-4 py-2 m-10 w-[200px] hover:text-black hover:bg-white xl:text-4xl"
                    type="button"
                    onClick={() => withdrawNFT()}
                  >
                    Withdraw
                  </button>
                </div>
              )
            ) : account.address === ownerOfContract ? (
              <div>
                <button
                  className="bg-black text-white rounded-lg text-2xl px-4 py-2 m-10 w-[200px] hover:text-black hover:bg-white xl:text-4xl"
                  type="button"
                  onClick={() => expiryCheckAuction(currentVehicle)}
                >
                  Restock
                </button>
              </div>
            ) : hasRecoveredFunds === true ? (
              <div>
                <button className="bg-white opacity-60 cursor-default text-black rounded-lg text-2xl px-4 py-2 m-10 w-[200px] xl:text-4xl">
                  Recover Funds
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="bg-black text-white rounded-lg text-2xl px-4 py-2 m-10 w-[200px] hover:text-black hover:bg-white xl:text-4xl"
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
                className="bg-black text-white rounded-lg font-[600] m-5 p-5 text-4xl hover:text-black hover:bg-white xl:text-4xl"
                type="submit"
              >
                Start Auction
              </button>
            </div>
          ) : (
            <div className="p-10">
              <p className="font-[600] p-5 text-4xl text-center">
                Auction isn't started
              </p>
            </div>
          )}
        </form>
        <FAQ />
      </div>
    </React.StrictMode>
  );
};

export default CardAuction;
