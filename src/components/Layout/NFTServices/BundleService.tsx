import { CheckCircleFill } from "@styled-icons/bootstrap";
import { readContract, writeContract } from "@wagmi/core";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import abiAsset from "../../../abi/TranscaAssetNFT.json";
import abiBundle from "../../../abi/TranscaBundleNFT.json";
import Button from "../../Button/Button";
import Message from "../../Message/Message";
import Popup from "../../Popup/Popup";
import { usePopups } from "../../Popup/PopupProvider";

const PopUpCreateBundle: React.FC<{ nfts: Array<any> }> = ({ nfts }) => {
  const [acitves, setActives] = useState<Array<number>>(new Array<number>());
  const [minting, setMinting] = useState(false);
  const [sig, setSig] = useState("");
  const { address } = useAccount();

  const onSelectNFT = (id: number) => {
    let isActive = checkActive(id);
    let temp = null;
    if (isActive) {
      temp = acitves.filter((res) => id !== res);
      setActives(temp);
      return;
    } else {
      temp = [...acitves, id];
      setActives(temp);
      return;
    }
  };
  //   useEffect(() => {
  //     onSelect(acitves);
  //   }, [acitves]);
  const checkActive = (id: number) => {
    let a = acitves.find((res) => id === res);
    if (a) {
      return true;
    }
    return false;
  };
  const onShowNFT = () => {
    let temp = null;
    if (nfts.length > 0) {
      temp = nfts.map((e, i) => {
        return (
          <tr key={i} className={`bg-[#251163] w-full border border-none rounded-xl text-gray-300 cursor-pointer`} onClick={() => onSelectNFT(e._assetId)}>
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
            <td className="px-4 py-3 text-center">{checkActive(i) && <CheckCircleFill size={20} color="green" />}</td>
          </tr>
        );
      });
    }
    return temp;
  };

  const {
    data: mintData,
    write,
    status: mintStatus,
    isLoading: mintLoading,
  } = useContractWrite({
    address: import.meta.env.VITE_TRANSCA_BUNDLE_NFT_CONTRACT! as any,
    abi: abiBundle,
    functionName: "deposit",
    args: [[0, 1], sig],
    onError(error) {
      console.log("7s200:minterr", error);
      setMinting(false);
    },
  });

  const {
    data: txData,
    isError: txError,
    isLoading: txLoading,
    isFetched,
  } = useWaitForTransaction({
    confirmations: 3,
    hash: mintData?.hash,
  });

  //   const onSigMessage = async () => {
  //     const messageHash = ethers.utils.sha256(ethers.utils.defaultAbiCoder.encode(["address", "uint256[]"], [address!, [[new BN(2, 10)]]]));
  //     const signature = await signMessage({
  //       message: messageHash,
  //     });
  //     return signature;
  //   };

  const onHandleMintBundle = async () => {
    setMinting(true);
    // const a = await onSigMessage();
    const write = await writeContract({
      address: import.meta.env.VITE_TRANSCA_BUNDLE_NFT_CONTRACT! as any,
      abi: abiBundle,
      functionName: "deposit",
      args: [[0, 1]],
    });
    console.log("7s200:write", write);
  };
  console.log("7s200:txn:", txData);

  return (
    <Popup className="bg-gray-50 min-w-[1000px]">
      <h1 className="mb-4 text-center font-bold text-[20px]">Popup</h1>
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

const BundleService: React.FC = () => {
  const { addPopup } = usePopups();
  const { address, isConnecting, isDisconnected } = useAccount();
  //   let [actives, setActives] = useState(new Array());
  //   const onSelect = (data: Array<any>) => {
  //     console.log("7s200:data", data);
  //     // setActives(data);
  //   };
  const onOpenPopUpCreateBundle = () => {
    addPopup({
      Component: () => {
        const [listNFTs, setListNFTs] = useState<Array<any>>([]);

        const {} = useContractRead({
          address: import.meta.env.VITE_TRANSCA_NFT_CONTRACT!,
          abi: abiAsset,
          functionName: "getAllAssetByUser",
          args: [address],
          onSuccess: async (data: Array<any>) => {
            for (let index = 0; index < data.length; index++) {
              const uri = await readContract({
                address: import.meta.env.VITE_TRANSCA_NFT_CONTRACT!,
                abi: abiAsset,
                functionName: "tokenURI",
                args: [data[index]._assetId],
              });
              if (uri) {
                const response = await fetch(uri as string)
                  .then((response) => response.json())
                  .catch(() => {
                    return null;
                  });
                if (response) {
                  data[index]._image = response.image;
                } else {
                  data[index]._image = uri;
                }
              }
            }
            setListNFTs(data);
          },
        });
        console.log("7s200:list", listNFTs);

        return <PopUpCreateBundle nfts={listNFTs} />;
      },
    });
  };
  return (
    <div className="bg-white flex-1 border border-none rounded-xl shadow-xl">
      <h3 className="text-center my-4 font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Create NFT Bundle</h3>
      <div className="w-full mx-auto">
        <img src="/icons/bundleNFT.webp" className="mx-auto max-w-[400px] max-h-[400px]" alt="" />
      </div>
      <div className="mx-4 my-4">
        <Message
          className={"space-x-2"}
          title={"Bundle"}
          content={
            "This is a solution that allows users to combine multiple RWAs NFTs into a single package - a unique RWAs NFT which has an overall value equal to the sum of the individual RWA NFT's values. The purpose of this is to create a NFTs package and minimize the number of transactions that users need to make when using RWA NFTs in financial platforms. Furthermore, users can take the advantage of adjusting the number of NFTs used to generate the package and putting it into an RWA NFT Bundle."
          }
        />
      </div>
      <div className="flex space-x-4 justify-center items-center my-4">
        <Button
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
          onClick={() => onOpenPopUpCreateBundle()}
        >
          Create Bundle
        </Button>
        <Button className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]">
          Unpack Bundle
        </Button>
      </div>
    </div>
  );
};
export default BundleService;
