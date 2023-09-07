import { CheckCircleFill } from "@styled-icons/bootstrap";
import { writeContract } from "@wagmi/core";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";
import abiBundle from "../../abi/TranscaBundleNFT.json";
import { setToast } from "../../redux/reducers/toastReducer";
import { useAppDispatch } from "../../redux/store";
import Button from "../Button/Button";
import Popup from "./Popup";
import { usePopups } from "./PopupProvider";

const PopupCreateBundle: React.FC<{ nfts: Array<any>; loadingData: boolean }> = ({ nfts, loadingData }) => {
  const [acitves, setActives] = useState<Array<any>>([]);
  const [minting, setMinting] = useState(false);
  const [sig, setSig] = useState("");
  const { address } = useAccount();
  const { removeAll } = usePopups();
  const dispatch = useAppDispatch();

  const onSelectNFT = (id: number) => {
    const ac = acitves!.filter((res) => id === res);
    if (ac.length === 0) {
      setActives([...acitves, id]);
    } else {
      let temp = acitves.filter((res) => id !== res);
      setActives(temp);
    }
  };

  const checkActive = (id: number) => {
    const ac = acitves!.filter((res) => id === res);
    if (ac.length > 0) {
      return true;
    }
    return false;
  };

  const onShowNFT = () => {
    let temp = null;
    if (nfts.length > 0) {
      temp = nfts.map((e, i) => {
        return (
          <tr key={i} className={`bg-[#251163] w-full border border-none rounded-xl text-gray-300 cursor-pointer`} onClick={() => onSelectNFT(Number(e._assetId))}>
            <td className="px-4 py-3 text-center">
              <div>
                <img className="max-w-[50px] max-h-[50px] border border-none rounded-xl" src={e._image} alt="nft" />
              </div>
            </td>
            <td className="px-4 py-3 text-center">{(e._assetType === 0 && "GOLD") || (e._assetType === 1 && "DIAMOND") || "OTHER"}</td>
            <td className="px-4 py-3 text-center">{Number(ethers.utils.formatUnits(e._weight)).toFixed(2)}</td>
            <td className="px-4 py-3 text-center">{Number(ethers.utils.formatUnits(e._oraklPrice, 26)).toFixed(2)}</td>
            <td className="px-4 py-3 text-center">{Number(e._appraisalPrice).toFixed(2)}</td>
            <td className="px-4 py-3 text-center">{Number(e._userDefinePrice).toFixed(2)}</td>
            <td className="px-4 py-3 text-center">{e._indentifierCode}</td>
            <td className="px-4 py-3 text-center">{checkActive(Number(e._assetId)) && <CheckCircleFill size={20} color="green" />}</td>
          </tr>
        );
      });
    }
    return temp;
  };

  const {
    data: txData,
    isError: txError,
    isLoading: txLoading,
    isFetched,
  } = useWaitForTransaction({
    confirmations: 3,
    // hash: mintData?.hash,
  });

  const onHandleMintBundle = async () => {
    setMinting(true);
    if (acitves.length === 0) {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "Please select NFT to mint a bundle",
          type: "info",
        }),
      );
      setMinting(false);
      return;
    }
    const write = await writeContract({
      address: import.meta.env.VITE_TRANSCA_BUNDLE_NFT_CONTRACT! as any,
      abi: abiBundle,
      functionName: "deposit",
      args: [acitves],
    });
    if (write.hash) {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "Mint bundle success!",
          type: "success",
        }),
      );
      setMinting(false);
      removeAll();
      return;
    } else {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "Something wrong!",
          type: "error",
        }),
      );
      setMinting(false);
      return;
    }
  };

  return (
    <Popup className="bg-gray-50 min-w-[1000px]">
      <h1 className="mb-4 text-center font-bold text-[20px]">Create Bundle</h1>
      <div className="relative overflow-x-auto mx-auto border border-none rounded-xl mt-4">
        <table className="w-full text-sm !text-white">
          <thead className="text-xs !text-white uppercase bg-btnprimary">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">
                NFT
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Weight
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Real Time Price
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Appraisal Price
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                User Define Price
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Indentifier Code
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Selected
              </th>
            </tr>
          </thead>
          <tbody>{onShowNFT()}</tbody>
        </table>
      </div>
      <div className="relative mx-auto border border-none rounded-xl mt-4 flex space-x-4 justify-center items-center">
        <Button
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
          loading={minting}
          onClick={onHandleMintBundle}
        >
          Create Bundle
        </Button>
        <Button className="!rounded-3xl text-black font-bold text-white min-w-[200px] leading-[21px]" type="reset">
          Cancel
        </Button>
      </div>
    </Popup>
  );
};

export default PopupCreateBundle;
