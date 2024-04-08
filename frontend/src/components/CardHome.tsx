import React from "react";
import { Link } from "react-router-dom";
import { ICardHome } from "../interface";

const CardHome: React.FC<ICardHome> = ({
  title,
  paragraph,
  button,
  image,
  link,
}) => {
  return (
    <React.StrictMode>
      <div className="relative overflow-hidden min-h-[600px]">
        <header className="flex flex-col text-center h-[600px] justify-center items-center p-1 text-white">
          <h2 className="text-2xl z-10">{title}</h2>
          <p className="text-4xl font-bold p-10 z-10 bg-transparent xl:w-[800px]">
            {paragraph}
          </p>
          <button className="text-xl shadow-xl hover:bg-white hover:text-black rounded-lg w-[200px] p-3 text-white z-10 xl:text-2xl">
            <Link to={`/${link}`}>{button}</Link>
          </button>
        </header>
        <div className="bg-gray-800 absolute w-[240%] top-[50%] left-[20%] translate-x-[-50%] translate-y-[-50%] lg:w-[150%] lg:left-[50%] xl:w-[100%]">
          <img
            src={image}
            alt="Moove mission"
            className="blur-[5px] grayscale-[20%] opacity-60"
          />
        </div>
      </div>
    </React.StrictMode>
  );
};

export default CardHome;
