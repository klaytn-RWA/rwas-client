// import Grow from "@mui/material/Grow";
import { useState } from "react";
import NFt from "../../../../public/nfts/diamond-3.png";
import Button from "../../Button/Button";

import Header from "../../Header/Header";

const Lottery: React.FC<{}> = () => {
  const [ticket, setTicket] = useState(0);
  const onShowNumber = () => {
    let temp: Array<any> = [];
    for (let index = 1; index <= 5; index++) {
      temp.push(
        <div
          className={`px-3 py-4 border border-2 border-purple-700 rounded-xl bg-purple-400 font-bold cursor-pointer ${ticket === index && "!border-green-500 !text-green-500"}`}
          onClick={() => onSelectNumber(index)}
        >
          {index}
        </div>,
      );
    }
    return temp;
  };
  const onSelectNumber = (ticket: number) => {
    setTicket(ticket);
  };
  return (
    <>
      <Header />
      <div className="text-white px-4 py-12 md:ml-64 mt-14 bg-gray-100 h-screen">
        <div className="lottery-body px-4 py-4 border border-none rounded-xl flex flex-col lg:flex-row justify-between items-center space-x-4">
          <div className=" max-w-[1300px] mx-auto flex flex-col justify-between items-center  md:flex md:flex-row space-x-12">
            <div className="px-6 lg:px-0 my-8 flex-1 flex flex-col justify-center">
              <h1 className="text-[50px] leading-[50px] font-extrabold">
                <p className="text-left">
                  Transca Lottery - Your Signature of <span className="text-[#8d1cfe]">Easy to get RWAs</span>
                </p>
              </h1>
              <div className="flex flex-col space-y-2 lg:flex lg:flex-row justify-center items-center space-x-6 py-6">
                <div className="text-[16px] leading-[26px]">
                  <p className="pb-4 mt-12">We believe that each NFT artwork represents the creativity and soul of the creator, and this deserves to be clearly expressed.</p>
                  <p>
                    The POINT of each NFT will be displayed in the order the users mint them, and there will be a leaderboard for POINT's owners, and we will have rewards for the
                    top 5 users with the highest points.
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-2"></div>
              <div className="mx-auto">
                <img src="./img/wheel-unscreen.gif" alt="wheel" />
              </div>
            </div>

            <div className="flex max-w-[400px] justify-center items-center">
              <div>
                <img className="max-w-[100%] max-h-[463px] boder-none rounded-xl" src={NFt} alt="nft" />
                <div className="flex flex-col space-y-3 py-2">
                  <div className="flex justify-center items-center space-x-4 z-10">
                    {/* <HomeDetailContainer title="Day" data={<LoadingV2 isLoading={contractLoading || !contractFetched}>{(Number(currentDay) + 1).toString()}</LoadingV2>} />
                    <HomeDetailContainer title="Mint Fee" data={"FREE"} />
                    <HomeDetailContainer title="Today Supply" data={<LoadingV2 isLoading={contractLoading || !contractFetched}>{`${mintPerDay}/300`}</LoadingV2>} /> */}
                    {onShowNumber()}
                  </div>
                  <div className="mx-auto z-10">
                    <Button
                      className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                      // onClick={() => onOpenPopUpCreateBundle()}
                    >
                      Buy ticket
                    </Button>
                  </div>
                  <div className="w-full flex justify-center items-center">
                    {/* <ConnectButton.Custom>
                      {({ account, chain, openConnectModal, openChainModal, authenticationStatus, mounted }) => {
                        const ready = mounted && authenticationStatus !== "loading";
                        const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

                        return (
                          <button
                            className={`bg-btnprimary w-full text-[20px] leading-[32px] px-6 py-2 border border-none rounded-3xl flex justify-center items-center disabled:bg-gray-200 disabled:text-gray-900`}
                            disabled={minting}
                            onClick={() => {
                              if (!connected) {
                                openConnectModal();
                              }

                              if (chain?.unsupported) {
                                openChainModal();
                              }

                              valid && mint();
                            }}
                          >
                            <LoadingV2 size={30} isLoading={loading} />
                            {!isConnected && "Connect wallet to mint"}
                            {valid && "Mint now"}
                            {minting && "Minting"}
                            {chain?.unsupported && "Switch Network"}
                          </button>
                        );
                      }}
                    </ConnectButton.Custom> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lottery;
