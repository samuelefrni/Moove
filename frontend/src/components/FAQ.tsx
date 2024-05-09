import React from "react";
import Footer from "./Footer";

const FAQ = () => {
  return (
    <React.StrictMode>
      <div className="p-5">
        <p className="font-[600] p-5 text-2xl text-center xl:text-4xl">FAQ</p>
        <hr />
        <p className="font-[600] p-3 text-start lg:text-xl xl:text-2xl">
          Come posso utilizzare un veicolo Moove?
        </p>
        <p className="italic p-3 text-justify xl:text-xl">
          Il primo passo è collegarsi al mondo Web3 attraverso l'utilizzo di un
          wallet. Una volta collegato con il tuo wallet, basterà selezionare un
          veicolo, acquistarlo e scansionare il codice QR del veicolo per
          sbloccarlo. Fatto!
        </p>
        <hr />
        <p className="font-[600] p-3 text-start lg:text-xl xl:text-2xl">
          Devo indossare un casco?
        </p>
        <p className="italic p-3 text-justify xl:text-xl">
          Consigliamo sempre di indossare un casco quando si guida un veicolo
          Moove. In alcune città è obbligatorio.
        </p>
        <hr />
        <p className="font-[600] p-3 text-start lg:text-xl xl:text-2xl">
          Quanto costa?
        </p>
        <p className="italic p-3 text-justify xl:text-xl">
          Il prezzo dei diversi veicoli varia a seconda di quanto
          l'amministrazione sceglie. Per sapere esattamente quanto costa un
          determinato veicolo basta controllarlo nella sezione dedicata al
          veicolo stesso.
        </p>
        <hr />
        <p className="font-[600] p-3 text-start lg:text-xl xl:text-2xl">
          Quanto dura?
        </p>
        <p className="italic p-3 text-justify xl:text-xl">
          Dal momento dell'acquisto il veicolo è accessibile attraverso il
          codice QR per le prossime 24h. Scadute queste, il veicolo non sarà più
          accessibile.
        </p>
        <hr />
        <p className="font-[600] p-3 text-start lg:text-xl xl:text-2xl">
          Perchè acquistare un veicolo all'asta?
        </p>
        <p className="italic p-3 text-justify xl:text-xl">
          La differenza principale tra un veicolo acquistato normalmente ed uno
          preso all'asta è la durata del veioclo stessto. Acquistando un veicolo
          all'asta questo sarà accessibile per 7 giorni.
        </p>
      </div>
      <Footer />
    </React.StrictMode>
  );
};

export default FAQ;
