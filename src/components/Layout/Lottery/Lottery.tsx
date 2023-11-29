// import Grow from "@mui/material/Grow";
import { useEffect, useState } from "react";
import NFt from "../../../../public/nfts/diamond-3.png";
import Button from "../../Button/Button";

import { readContract, waitForTransaction, writeContract } from "@wagmi/core";
import { useAccount, useContractRead } from "wagmi";
import lotteryAbi from "../../../abi/Lottery.json";
import abiUSDTSimulator from "../../../abi/USDTSimulator.json";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { ethers } from "ethers";
import { getLotteries, selectLottery } from "../../../redux/reducers/lotteryReducer";
import { setToast } from "../../../redux/reducers/toastReducer";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { truncateSuiTx } from "../../../services/address";
import Header from "../../Header/Header";
import Popup from "../../Popup/Popup";
import { usePopups } from "../../Popup/PopupProvider";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const Lottery: React.FC<{}> = () => {
  const { addPopup } = usePopups();

  // var wsProvider = new ethers.providers.WebSocketProvider(import.meta.env.VITE_KAYTN_WSS!);
  // const contract = new ethers.Contract(import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!, lotteryAbi, wsProvider);
  // contract.on("__Update_Winner", (data) => {
  //   if (data) {
  //     return addPopup({
  //       Component: () => {
  //         return (
  //           <Popup className="popupbody min-w-[800px]">
  //             <h3 className="text-center my-4 font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">Congratulation</h3>

  //             <div className="flex justify-center items-center">
  //               <img className="w-[150px] h-[150px]" src="./img/wheel-unscreen.gif" alt="" />
  //             </div>
  //             <div className="flex space-x-4 justify-center items-center w-full text-3xl">
  //               <div className="text-white">Lucky number: </div>
  //               <h3 className="text-center my-4 font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">#{Number(data)}</h3>
  //             </div>
  //           </Popup>
  //         );
  //       },
  //     });
  //   }
  //   // dispatch(getLotteries({}));
  // });

  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const lotteryRx = useAppSelector(selectLottery);
  const [ticket, setTicket] = useState(-1);
  const [isLoadingBuyTicket, setIsLoadingBuyTicket] = useState(false);

  useEffect(() => {
    dispatch(getLotteries({}));
  }, []);
  // console.log("7s200:lotteryRx", lotteryRx);

  const onShowNumber = () => {
    let temp: Array<any> = [];
    if (!lotteryRx.loading && lotteryRx.lotteries.length > 0) {
      temp = lotteryRx.lotteries[lotteryRx.lotteries.length - 1].buyers.map((e, i) => {
        return (
          <div
            key={i}
            className={`px-3 py-4 border border-2 border-purple-700 rounded-xl bg-purple-400 font-bold cursor-pointer ${
              ticket === e.number && "!border-green-500 !text-green-500"
            } ${e.buyer !== "0x0000000000000000000000000000000000000000" && "!bg-gray-200 !cursor-not-allowed"}`}
            onClick={() => {
              if (e.buyer !== "0x0000000000000000000000000000000000000000") {
                return;
              }
              onSelectNumber(e.number);
            }}
          >
            {e.number.toString()}
          </div>
        );
      });
    }

    return temp;
  };
  const onShowLotteryHistories = () => {
    let temp = null;
    if (!lotteryRx.loading && lotteryRx.lotteries.length > 0) {
      temp = lotteryRx.lotteries.map((e, i) => {
        return (
          <tr key={i} className="bg-[#251163] w-full border border-none rounded-xl text-gray-300 font-bold">
            <td className="px-4 py-3 text-center">
              <img className="w-[50px] h-[60px] border border-none rounded-xl" src={e.asset.image} alt="" />
            </td>
            <td className="px-4 py-3 text-center">{ethers.utils.formatEther(e.pricePerNumber.toString())}$</td>
            <td className="px-4 py-3 text-center">
              {Number(e.expiredAt) < Date.now() / 1000 || e.winner !== "0x0000000000000000000000000000000000000000" ? Number(e.winNumber).toString() : ""}
            </td>
            <td className="px-4 py-3 text-center">{Number(e.expiredAt) < Date.now() / 1000 && truncateSuiTx(e.winner)}</td>
          </tr>
        );
      });
    }
    return temp?.reverse();
  };
  const onShowEndedTag = () => {
    if (!lotteryRx.loading && lotteryRx.lotteries[lotteryRx.lotteries.length - 1]) {
      if (lotteryRx.lotteries[lotteryRx.lotteries.length - 1].winner !== "0x0000000000000000000000000000000000000000") {
        return (
          <div className="border border-4 border-red-400 rounded-2xl left-0 absolute top-1/3 -rotate-45 text-center px-2">
            <div className="font-bold text-[40px]">Ended</div>
            <div className="font-semibold">Winner: {lotteryRx.lotteries[lotteryRx.lotteries.length - 1].winner}</div>
          </div>
        );
      }
    }
    return <></>;
  };
  const onSelectNumber = (ticket: number) => {
    setTicket(ticket);
  };
  const onHandleBuyTicket = async () => {
    if (ticket === -1) {
      return;
    }
    setIsLoadingBuyTicket(true);
    const lottery = await readContract({
      address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
      abi: lotteryAbi,
      functionName: "getCurrentLottery",
      args: [],
    });

    if ((lottery as any).winner !== "0x0000000000000000000000000000000000000000") {
      setIsLoadingBuyTicket(false);
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "Lottery session ended",
          type: "info",
        }),
      );
      return;
    }
    const data = (await readContract({
      address: import.meta.env.VITE_TRANSCA_TOKEN_CONTRACT!,
      abi: abiUSDTSimulator,
      functionName: "allowance",
      args: [address, import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!],
    })) as bigint;
    console.log("7s200:data", data);

    if (Number(data) <= Number((lottery as any).pricePerNumber)) {
      try {
        const approve = await writeContract({
          address: import.meta.env.VITE_TRANSCA_TOKEN_CONTRACT!,
          abi: abiUSDTSimulator,
          functionName: "approve",
          args: [import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!, (lottery as any).pricePerNumber],
        });

        const data = await waitForTransaction({ hash: approve.hash });
        if (data.status === "reverted") {
          console.log(data);
          dispatch(
            setToast({
              show: true,
              title: "",
              message: "Approve failed",
              type: "error",
            }),
          );

          setIsLoadingBuyTicket(false);
          return;
        }
      } catch (error) {
        console.error(error);
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Approve failed",
            type: "error",
          }),
        );

        setIsLoadingBuyTicket(false);
        return;
      }
    }

    const sign = await writeContract({
      address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
      abi: lotteryAbi,
      functionName: "buySlot",
      args: [(lottery as any).id, ticket, (lottery as any).pricePerNumber],
    });
    if (sign.hash) {
      const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: sign.hash });
      if (waitTranscation.status === "success") {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Buy ticket success",
            type: "success",
          }),
        );
        setIsLoadingBuyTicket(false);
        dispatch(getLotteries({}));
        setTicket(-1);
        return;
      } else {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Transcation wrong!",
            type: "error",
          }),
        );
        setIsLoadingBuyTicket(false);
        return;
      }
    }
  };
  // const onShowPopUpWinner = () => {
  //   return addPopup({
  //     Component: () => {
  //       return (
  //         <Popup className="popupbody min-w-[800px]">
  //           <h3 className="text-center my-4 font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">Congratulation</h3>

  //           <div className="flex justify-center items-center">
  //             <img className="w-[150px] h-[150px]" src="./img/wheel-unscreen.gif" alt="" />
  //           </div>
  //           <div className="flex space-x-4 justify-center items-center w-full text-3xl">
  //             <div className="text-white">Lucky number: </div>
  //             <h3 className="text-center my-4 font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">#1</h3>
  //           </div>
  //         </Popup>
  //       );
  //     },
  //   });
  // };

  const onShowCounter = () => {
    let temp = null;
    if (!lotteryRx.loading && lotteryRx.lotteries.length > 0 && lotteryRx.lotteries[lotteryRx.lotteries.length - 1]) {
      const lottery = lotteryRx.lotteries[lotteryRx.lotteries.length - 1];
      const time = dayjs(Number(lottery.expiredAt) * 1000).fromNow();
      temp = (
        <div className="flex justify-between space-x-2 font-bold text-24 leading-24 px-4 py-1 border border-none rounded-2xl bg-blue-500 w-2/3">
          <div>Lottery Ended At:</div>
          <div className="font-semibold">
            {time.toString()} {Number(lottery.expiredAt) * 1000 < Date.now() && "(Ended)"}
          </div>
        </div>
      );
    }
    return temp;
  };

  const {} = useContractRead({
    address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
    abi: lotteryAbi,
    functionName: "getCurrentLottery",
    args: [],
    watch: true,

    onSuccess: (data) => {
      if ((data as any).isSuccess === true && Number((data as any).expiredAt) + 50 > Date.now() / 1000) {
        return addPopup({
          Component: () => {
            return (
              <Popup className="popupbody min-w-[800px]">
                <h3 className="text-center my-4 font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">Congratulation</h3>

                <div className="flex justify-center items-center">
                  <img className="w-[150px] h-[150px]" src="./img/wheel-unscreen.gif" alt="" />
                </div>
                <div className="flex space-x-4 justify-center items-center w-full text-3xl">
                  <div className="text-white">Lucky number: </div>
                  <h3 className="text-center my-4 font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    #{Number((data as any).winNumber)}
                  </h3>
                </div>
              </Popup>
            );
          },
        });
      }
    },
  });

  return (
    <>
      <Header />
      <div className="text-white px-4 py-12 md:ml-64 mt-14 bg-gray-100 h-screen">
        <div className="lottery-body px-4 py-4 border border-none rounded-xl flex flex-col justify-between items-center space-x-4">
          <div className=" max-w-[1300px] mx-auto flex flex-col justify-between items-center  md:flex md:flex-row space-x-12">
            <div className="px-6 lg:px-0 my-8 flex-1 flex flex-col justify-center">
              <h1 className="text-[50px] leading-[50px] font-extrabold">
                <p className="text-left">
                  Transca Lottery - Your Signature of <span className="text-[#8d1cfe]">Easy to get RWAs</span>
                </p>
              </h1>
              <div className="flex flex-col space-y-2 lg:flex lg:flex-row justify-center items-center space-x-6 py-6">
                <div className="text-[16px] leading-[26px]">
                  {/* <p className="pb-4 mt-12">We believe that each NFT artwork represents the creativity and soul of the creator, and this deserves to be clearly expressed.</p> */}
                  <p>
                    Transca will generate a specific number of tickets for each asset, with the total value of these tickets matching the asset's prize value. The lottery winner
                    will be awarded an NFT representing the asset through a Smart Contract.
                  </p>
                </div>
              </div>
              <div>
                {onShowCounter()}
                {/* {!lotteryRx.loading && lotteryRx.lotteries.length > 0 && lotteryRx.lotteries[lotteryRx.lotteries.length - 1] ? <div>Counter {Timer(1701505682)}</div> : <></>} */}
              </div>
              <div className="flex flex-col space-y-2"></div>
              {/* roll */}
              {/* <div className="mx-auto">
                <img src={"./img/wheel-unscreen.gif"} alt="wheel" />
              </div> */}
            </div>

            <div className="flex max-w-[400px] justify-center items-center">
              <div>
                <div className="relative">
                  <img
                    className="relative max-w-[100%] max-h-[463px] boder-none rounded-xl"
                    src={!lotteryRx.loading && lotteryRx.lotteries[lotteryRx.lotteries.length - 1] ? lotteryRx.lotteries[lotteryRx.lotteries.length - 1].asset.image : NFt}
                    alt="nft"
                  />
                  {onShowEndedTag()}
                </div>

                <div className="flex flex-col space-y-3 py-2">
                  <div className="flex justify-center items-center space-x-4 z-10">
                    {/* <HomeDetailContainer title="Day" data={<LoadingV2 isLoading={contractLoading || !contractFetched}>{(Number(currentDay) + 1).toString()}</LoadingV2>} />
                    <HomeDetailContainer title="Mint Fee" data={"FREE"} />
                    <HomeDetailContainer title="Today Supply" data={<LoadingV2 isLoading={contractLoading || !contractFetched}>{`${mintPerDay}/300`}</LoadingV2>} /> */}
                    {lotteryRx.loading ? "..." : onShowNumber()}
                  </div>
                  <div className="mx-auto z-10">
                    <Button
                      className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                      onClick={() => onHandleBuyTicket()}
                      loading={isLoadingBuyTicket}
                    >
                      Buy ticket
                    </Button>
                  </div>
                  <div className="w-full flex justify-center items-center"></div>
                </div>
              </div>
            </div>
          </div>
          <div className=" max-w-[1300px] mx-auto flex flex-col justify-between items-center  md:flex md:flex-row space-x-12">
            <div className="max-w-[1000px] mx-auto px-6 py-16">
              <h2 className="text-center text-[32px] leading-[32px] font-bold my-4 lg:px-20">Transca Lottery Histories</h2>

              <div className="relative overflow-x-auto max-w-[700px] mx-auto border border-none rounded-xl mt-4">
                <table className="w-full text-sm !text-white">
                  <thead className="text-xs !text-white uppercase bg-btnprimary">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-center">
                        Asset
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Ticket price
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Win Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Winner
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {onShowLotteryHistories()}
                    {/* {Rates.map((e, i) => {
                      return (
                        <tr key={i} className="bg-[#251163] w-full border border-none rounded-xl text-gray-300">
                          <td className="px-4 py-3 text-center">{5 - i}</td>

                          <td className="px-4 py-3 text-center">{e.point}</td>
                          <td className="px-4 py-3 text-center">{e.maximumAmount}</td>
                          <td className="px-4 py-3 text-center">{e.possiblity}%</td>
                        </tr>
                      );
                    })} */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lottery;
