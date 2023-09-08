// Copyright (c) Fewcha. All rights reserved.

import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import cn from "../../services/cn";

export type KanaCoin = {
  address: string;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
};

export const COINS_DATA: Array<KanaCoin> = [
  // { address: "7s200", decimals: 18, logoURI: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png", name: "Bitcoin", symbol: "BTC" },
  { address: "7s201", decimals: 8, logoURI: "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Tether-USDT-icon.png", name: "Tether", symbol: "USDT" },
];

const KanaDropdownOption: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg className={cn("-mr-1 ml-2 h-5 w-5", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#282932" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
        stroke="#282932"
        fill="#282932"
      />
    </svg>
  );
};

const KanaSelectDropdown: React.FC<{
  data: Array<any>;
  onSelectCoin: any;
  currentCoin: string;
}> = ({ data, onSelectCoin, currentCoin }) => {
  const [isActive, setIsActive] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    setIsActive(false);
  });

  const getCurrentCoin = () => {
    let current: KanaCoin | null = null;

    if (data.length > 0 && currentCoin) {
      current = data.find((item: KanaCoin) => item.address === currentCoin);
    }
    if (current) {
      return (
        <div className="flex items-center justify-center space-x-2">
          <img src={current.logoURI} alt="" style={{ height: 18, width: 18 }} />
          <div>{current.symbol}</div>
        </div>
      );
    }

    return null;
  };

  const onShowOption = () => {
    if (data.length > 0) {
      return data.map((item: KanaCoin, index) => {
        return (
          <button className={`flex items-center justify-center px-2 py-1 space-x-1`} key={index} value={item.address} type="button" onClick={() => onSelectCoinRs(item.address)}>
            <img src={item.logoURI} alt="" style={{ height: 18, width: 18 }} />
            <div className="text-left w-2/3">{item.symbol}</div>
          </button>
        );
      });
    }

    return null;
  };

  const onSelectCoinRs = (resource: string) => {
    onSelectCoin(resource);
    setIsActive(false);
  };

  return (
    <div className={`relative inline-block text-left`} ref={ref}>
      <div>
        <div
          className={`cursor-pointer max-w-[120px] text-[14px] inline-flex w-full justify-center items-center rounded-xl border px-2 py-1 shadow-sm`}
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => {
            setIsActive(!isActive);
          }}
        >
          {getCurrentCoin()}

          <KanaDropdownOption />
        </div>
      </div>
      <div
        className={`${
          !isActive ? "hidden" : ""
        } absolute !bg-white right-0 z-50 mt-1 origin-top-right border border-gray-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="py-1 flex flex-col text-[12px]">{onShowOption()}</div>
      </div>
    </div>
  );
};

export default KanaSelectDropdown;
