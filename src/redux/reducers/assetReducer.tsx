import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import { readContract } from "@wagmi/core";
import { ethers } from "ethers";
import abiAsset from "../../abi/TranscaAssetNFT.json";
import { RootState } from "../store";

export type Asset = {
  appraisalPrice: number;
  assetId: number;
  assetType: number;
  expireTime: number;
  image: string;
  indentifierCode: "string";
  oraklPrice: number;
  owner: string;
  startTime: number;
  userDefinePrice: number;
  weight: number;
};

export type MintReq = {
  id: number;
  appraisalPrice: number;
  assetId: number;
  assetType: number;
  expireTime: number;
  image: string;
  indentifierCode: string;
  oraklPrice: number;
  owner: string;
  executed: boolean;
  userDefinePrice: number;
  weight: number;
  isAuditSign: boolean;
  isStockerSign: boolean;
  isTranscaSign: boolean;
};

export const getAssets = createAsyncThunk("asset/get", async ({ address }: { address: string }, { getState, dispatch }) => {
  try {
    if (address.length === 0 || !address) {
      return [];
    }
    const ass = await readContract({
      address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
      abi: abiAsset,
      functionName: "getAssetDetail",
      args: [2],
    });

    const listAsset = await readContract({
      address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
      abi: abiAsset,
      functionName: "getAllAssetByUser",
      args: [address!],
    });

    if (!listAsset || (listAsset as Array<Asset>).length === 0) {
      return [];
    } else {
      const list = listAsset as Array<Asset>;

      for (let index = 0; index < list.length; index++) {
        const uri = await readContract({
          address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
          abi: abiAsset,
          functionName: "tokenURI",
          args: [list[index].assetId],
        });
        if (uri) {
          const response = await fetch(uri as string)
            .then((response) => response.json())
            .catch(() => {
              return null;
            });
          if (response) {
            list[index].image = response.image;
          } else {
            list[index].image = uri as any;
          }
        }
      }
      return list;
    }
  } catch (error: any) {
    console.error(error);
    return [];
  }
});

export const getAssetDetail = createAsyncThunk("asset/detail", async ({ id, cb }: { id: number; cb: (data: Asset) => void }) => {
  try {
    const nftData = await readContract({
      address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
      abi: abiAsset,
      functionName: "getAssetDetail",
      args: [id],
    });

    let temp: any = nftData;
    const uri = await readContract({
      address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
      abi: abiAsset,
      functionName: "tokenURI",
      args: [id],
    });

    if (uri) {
      await fetch(uri as string)
        .then(async (response) => {
          const a = await response.json();
          temp.image = a.image;
        })
        .catch(() => {
          temp.image = uri;
          return null;
        });
    }
    cb(temp);
  } catch (error) {}
});

export const getRequestMint = createAsyncThunk("asset/requests", async ({}: {}) => {
  const reqs = (await readContract({
    address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT! as any,
    abi: abiAsset,
    functionName: "getAllMintRequest",
    args: [],
  })) as Array<any>;
  // console.log("7s200:reqs", reqs);
  let result: Array<MintReq> = [];
  if (reqs.length > 0) {
    for (let index = 0; index < reqs.length; index++) {
      const element = reqs[index];
      let temp: MintReq = {
        id: element.id,
        appraisalPrice: Number(ethers.utils.formatEther(element.appraisalPrice)),
        assetId: element.assetId,
        assetType: element.assetType,
        expireTime: Number(element.expireTime),
        image: "",
        executed: element.executed,
        indentifierCode: element.indentifierCode,
        oraklPrice: 0,
        owner: element.to,
        userDefinePrice: Number(ethers.utils.formatEther(element.userDefinePrice)),
        weight: Number(ethers.utils.formatEther(element.weight)),
        isAuditSign: element.isAuditSign,
        isStockerSign: element.isStockerSign,
        isTranscaSign: element.isTranscaSign,
      };
      const response = await fetch(element.tokenUri as string)
        .then((response) => response.json())
        .catch(() => {
          return null;
        });

      if (response) {
        temp.image = response.image;
      }
      result.push(temp);
    }
  }
  return result;
});

export type AssetReducer = {
  assets: Asset[];
  reqs: MintReq[];
  loading: boolean;
};

export const defaultAssetReducer: AssetReducer = {
  assets: [],
  reqs: [],
  loading: false,
};

const assetReducer = createReducer(defaultAssetReducer, (builder) => {
  builder
    .addCase(getAssets.fulfilled, (state, action) => {
      state.loading = false;
      state.assets = action.payload;
    })
    .addCase(getAssets.rejected, (state) => {
      return { ...state, loading: false };
    })
    .addCase(getAssets.pending, (state) => {
      return { ...state, loading: true };
    })
    .addCase(getRequestMint.fulfilled, (state, action) => {
      state.loading = false;
      state.reqs = action.payload;
    })
    .addCase(getRequestMint.rejected, (state) => {
      return { ...state, loading: false };
    })
    .addCase(getRequestMint.pending, (state) => {
      return { ...state, loading: true };
    });
});

export const selectAsset = (state: RootState) => state.asset;

export default assetReducer;
