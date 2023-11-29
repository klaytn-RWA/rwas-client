import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import { readContract } from "@wagmi/core";
import lotteryABI from "../../abi/Lottery.json";
import abiAsset from "../../abi/TranscaAssetNFT.json";
import { RootState } from "../store";
import { Asset } from "./assetReducer";

export type Lottery = {
  assetId: any;
  createdAt: any;
  duration: any;
  expiredAt: any;
  id: any;
  pricePerNumber: any;
  totalNumber: any;
  winNumber: any;
  winner: string;
  isSuccess: boolean;
  buyers: Array<Buyer>;
  asset: Asset;
};

export type Buyer = {
  buyer: string;
  number: any;
};

export const getLotteries = createAsyncThunk("lottery/get", async ({}: {}, { getState, dispatch }) => {
  try {
    const currentId = await readContract({
      address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
      abi: lotteryABI,
      functionName: "lotteryId",
      args: [],
    });
    if (currentId === 0) {
      return [];
    }
    let result: Array<Lottery> = [];
    for (let index = 0; index < Number(currentId); index++) {
      const lottery = (await readContract({
        address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
        abi: lotteryABI,
        functionName: "getLottery",
        args: [index],
      })) as Lottery;

      if (Number(lottery.assetId) >= 0) {
        const nftData = await readContract({
          address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
          abi: abiAsset,
          functionName: "getAssetDetail",
          args: [lottery.assetId],
        });
        let temp: any = nftData;
        const uri = await readContract({
          address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
          abi: abiAsset,
          functionName: "tokenURI",
          args: [lottery.assetId],
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
        lottery.asset = temp;
        const buyers = (await readContract({
          address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
          abi: lotteryABI,
          functionName: "getLotteryBuyers",
          args: [lottery.id],
        })) as Array<Buyer>;
        if (buyers.length > 0) {
          lottery.buyers = buyers;
        }
        result.push(lottery);
      }
    }
    return result;
  } catch (error: any) {
    console.error(error);
    return [];
  }
});

export type LotteryReducer = {
  lotteries: Lottery[];
  loading: boolean;
};

export const defaultLotteryReducer: LotteryReducer = {
  lotteries: [],
  loading: false,
};

const lotteryReducer = createReducer(defaultLotteryReducer, (builder) => {
  builder
    .addCase(getLotteries.fulfilled, (state, action) => {
      state.loading = false;
      state.lotteries = action.payload;
    })
    .addCase(getLotteries.rejected, (state) => {
      return { ...state, loading: false };
    })
    .addCase(getLotteries.pending, (state) => {
      return { ...state, loading: true };
    });
});

export const selectLottery = (state: RootState) => state.lottery;

export default lotteryReducer;
