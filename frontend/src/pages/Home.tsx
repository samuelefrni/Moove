import React from "react";
import { useAccount } from "wagmi";

const Home = () => {
  const account = useAccount();

  return (
    <React.StrictMode>
      {account.status == "disconnected" && (
        <React.StrictMode>
          <div>
            <h1>Hello World</h1>
          </div>
        </React.StrictMode>
      )}
      {account.status == "connected" && (
        <React.StrictMode>
          <div>
            <h1>{account.address}</h1>
          </div>
        </React.StrictMode>
      )}
    </React.StrictMode>
  );
};

export default Home;
