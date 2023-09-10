import { CheckCircleFill } from "@styled-icons/bootstrap";
import { readContract, waitForTransaction, writeContract } from "@wagmi/core";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import abiTranscaAssetNFT from "../../abi/TranscaAssetNFT.json";
import abiBundle from "../../abi/TranscaBundleNFT.json";
import { transcaAsset, transcaBundle } from "../../config";
import { getAssets } from "../../redux/reducers/assetReducer";
import { getBundles } from "../../redux/reducers/bundleReducer";
import { setToast } from "../../redux/reducers/toastReducer";
import { useAppDispatch } from "../../redux/store";
import Button from "../Button/Button";
import Popup from "./Popup";
import { usePopups } from "./PopupProvider";

const PopupCreateBundle: React.FC<{ nfts: Array<any>; loadingData: boolean }> = ({ nfts, loadingData }) => {
  console.log(nfts, 111);

  const [selected, setActives] = useState<Array<any>>([]);
  const [minting, setMinting] = useState(false);
  const { removeAll } = usePopups();
  const dispatch = useAppDispatch();
  const { address } = useAccount();

  const onSelectNFT = (id: number) => {
    const ac = selected!.filter((res) => id === res);
    if (ac.length === 0) {
      setActives([...selected, id]);
    } else {
      let temp = selected.filter((res) => id !== res);
      setActives(temp);
    }
  };

  const checkActive = (id: number) => {
    const ac = selected!.filter((res) => id === res);
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
          <tr key={i} className={`bg-[#251163] w-full border border-none rounded-xl text-gray-300 cursor-pointer`} onClick={() => onSelectNFT(Number(e.assetId))}>
            <td className="px-4 py-3 text-center">
              <div>
                <img className="max-w-[50px] max-h-[50px] border border-none rounded-xl" src={e.image} alt="nft" />
              </div>
            </td>
            <td className="px-4 py-3 text-center">{(e.assetType === 0 && "GOLD") || (e.assetType === 1 && "DIAMOND") || "OTHER"}</td>
            <td className="px-4 py-3 text-center">{Number(ethers.utils.formatUnits(e.weight)).toFixed(2)}</td>
            <td className="px-4 py-3 text-center">{Number(ethers.utils.formatUnits(e.oraklPrice, 26)).toFixed(2)}</td>
            <td className="px-4 py-3 text-center">{Number(e.appraisalPrice).toFixed(2)}</td>
            <td className="px-4 py-3 text-center">{Number(e.userDefinePrice).toFixed(2)}</td>
            <td className="px-4 py-3 text-center">{e.indentifierCode}</td>
            <td className="px-4 py-3 text-center">{checkActive(Number(e.assetId)) && <CheckCircleFill size={20} color="green" />}</td>
          </tr>
        );
      });
    }
    return temp;
  };

  const onHandleMintBundle = async () => {
    setMinting(true);

    if (selected.length === 0) {
      dispatch(setToast({ show: true, title: "", message: "Please select NFT to mint a bundle", type: "info" }));
      setMinting(false);

      return;
    }

    // await Promise.all(
    //   selected.map(async (item) => {
    const data = await readContract({
      address: transcaAsset,
      abi: abiTranscaAssetNFT,
      functionName: "isApprovedForAll",
      args: [address, transcaBundle],
    });

    if (!data) {
      try {
        const approveAllNFTs = await writeContract({
          address: transcaAsset,
          abi: abiTranscaAssetNFT,
          functionName: "setApprovalForAll",
          args: [transcaBundle, true],
        });

        const data = await waitForTransaction({ hash: approveAllNFTs.hash });
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

          setMinting(false);
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

        setMinting(false);
        return;
      }
    }
    //   }),
    // );

    const write = await writeContract({
      address: import.meta.env.VITE_TRANSCA_BUNDLE_CONTRACT! as any,
      abi: abiBundle,
      functionName: "deposit",
      args: [selected],
    });

    if (write.hash) {
      const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: write.hash });
      if (waitTranscation.status === "success") {
        dispatch(setToast({ show: true, title: "", message: "Create bundle success", type: "success" }));
        dispatch(getAssets({ address: address! }));
        dispatch(getBundles({ address: address! }));
        setMinting(false);
        removeAll();

        return;
      } else {
        dispatch(setToast({ show: true, title: "", message: "Transcation wrong!", type: "error" }));

        return;
      }
    } else {
      dispatch(setToast({ show: true, title: "", message: "Something wrong!", type: "error" }));

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
        <Button
          className="!rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
          type="reset"
          onClick={() => {
            removeAll();
          }}
        >
          Cancel
        </Button>
      </div>
    </Popup>
  );
};

export default PopupCreateBundle;
