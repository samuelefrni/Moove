import React, { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { walletConnect, injected } from "wagmi/connectors";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setHamburgerMenuIsOpen } from "../state/navbar/navbarSlice";

const HamburgerMenu = () => {
  const account = useAccount();
  const { connect } = useConnect();
  const dispatch = useDispatch();

  const [expandItem, setExpandItem] = useState<string | null>();

  const handleExpand = (itemName: string) => {
    if (expandItem == itemName) {
      setExpandItem(null);
    } else {
      setExpandItem(itemName);
    }
  };

  return (
    <React.StrictMode>
      <div>
        <div className="text-center">
          {account.status == "connected" ? (
            <button className="z-10 p-3 m-2 text-2xl bg-transparent rounded-xl font-bold xl:text-6xl hover:underline">
              <Link to={"/account"}>
                <span
                  className="button-text"
                  onClick={() => dispatch(setHamburgerMenuIsOpen())}
                >{`${account.address.slice(0, 12).toUpperCase()}...`}</span>
              </Link>
            </button>
          ) : (
            <div className="text-center p-5">
              <button
                className="text-white w-[250px] p-5 m-5 text-2xl bg-black rounded-xl font-bold xl:text-4xl xl:w-[350px] hover:underline"
                onClick={() =>
                  connect({
                    connector: walletConnect({
                      projectId: import.meta.env.VITE_PROJECT_ID,
                    }),
                  })
                }
              >
                WalletConnect
              </button>
              <button
                className="text-white w-[250px] p-5 m-5 text-2xl bg-black rounded-xl font-bold xl:text-4xl xl:w-[350px] hover:underline"
                onClick={() => connect({ connector: injected() })}
              >
                Metamask
              </button>
            </div>
          )}
        </div>
        <ul className="flex flex-col font-[600] min-h-[600px]">
          <li className="text-3xl p-10 xl:text-4xl xl:p-15">
            <div className="flex justify-between">
              <span>Su di noi</span>
              <button onClick={() => handleExpand("Su di noi")}>↓</button>
            </div>
            {expandItem == "Su di noi" && (
              <p className="text-[18px] text-justify font-[400] my-2 xl:text-[22px]">
                Moove è un’azienda leader nella micro mobilità condivisa. I loro
                mezzi sono disponibili in 20 città europee.
              </p>
            )}
          </li>
          <li className="text-3xl p-10 xl:text-4xl xl:p-15">
            <div className="flex justify-between">
              <span>Perchè Moove</span>
              <button onClick={() => handleExpand("Perchè Moove")}>↓</button>
            </div>
            {expandItem == "Perchè Moove" && (
              <p className="text-[18px] text-justify font-[400] my-2 xl:text-[22px]">
                Moove è un'azienda all'avanguardia che non solo si impegna a
                fornire soluzioni di mobilità condivisa sostenibili, ma è anche
                pioniera nell'adozione delle tecnologie emergenti nel settore
                della blockchain e del web3. Attraverso l'utilizzo di Ethereum e
                smart contract, Moove ha implementato soluzioni innovative per
                migliorare l'esperienza dei suoi utenti e garantire una maggiore
                trasparenza e sicurezza nelle transazioni.
              </p>
            )}
          </li>
          <li className="text-3xl p-10 xl:text-4xl xl:p-15">
            <div className="flex justify-between">
              <span>Veicoli</span>
              <button onClick={() => handleExpand("Veicoli")}>↓</button>
            </div>
            {expandItem == "Veicoli" && (
              <p className="text-[18px] text-justify font-[400] my-2 xl:text-[22px]">
                I mezzi messi a disposizione sono bici, scooter e monopattini,
                tutti elettrici.
              </p>
            )}
          </li>
          <li className="text-3xl p-10 xl:text-4xl xl:p-15">
            <div className="flex justify-between">
              <span>Locations</span>
              <button onClick={() => handleExpand("Locations")}>↓</button>
            </div>
            {expandItem == "Locations" && (
              <p className="text-[18px] text-justify font-[400] my-2 xl:text-[22px]">
                Attualmente in più di 20 città europee: Bruxelles, Roma, Londra,
                Varsavia, Parigi, Tel Aviv, Madrid etc. Molte altre in arrivo!
              </p>
            )}
          </li>
          <li className="text-3xl p-10 xl:text-4xl xl:p-15">
            <div className="flex justify-between">
              <span>Download App</span>
              <button onClick={() => handleExpand("Download App")}>↓</button>
            </div>
            {expandItem == "Download App" && (
              <p className="text-[18px] text-justify font-[400] my-2 xl:text-[22px]">
                Vi terremo aggiornati sui progressi del nostro lavoro e non
                vediamo l'ora di condividere con voi l'esperienza della nuova
                app Moove. Restate sintonizzati per ulteriori aggiornamenti!
              </p>
            )}
          </li>
        </ul>
      </div>
    </React.StrictMode>
  );
};

export default HamburgerMenu;
