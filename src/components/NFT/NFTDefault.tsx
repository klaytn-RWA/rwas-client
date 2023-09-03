const NFTProperty: React.FC<{ title: string; content: string }> = ({ title, content }) => {
  return (
    <div>
      <div className="bg-gray-100 shadow-xl border border-none rounded-md text-center">
        <div className="text-[13px] font-bold">{title}</div>
        <div className="text-[13px]">{content}</div>
      </div>
    </div>
  );
};
const NFTDefault: React.FC<{}> = () => {
  return (
    <div className="">
      <div>
        <img className="mx-auto max-w-[200px] max-h-[300px] border border-none rounded-xl" src="/icons/gold1.png" alt="nft-icon" />
        <div className="font-semibold text-center">#GOLD-01</div>
      </div>
      <div>
        <div className="font-bold text-[14px] m-2">Properties</div>
        <div className="m-2">
          <NFTProperty title="code" content="gold-paxxxxxxxxx" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <NFTProperty title="weight" content="3.1 gram" />
          <NFTProperty title="ounce" content="1" />
        </div>
      </div>
      <div className="my-4">
        <div className={`bg-green-100 border-green-500 w-fit  border  rounded-2xl text-green-700 px-4 py-3`} role="alert">
          <p className="font-bold text-[13px]">Quick Raise:</p> <p className="text-[13px]">Your #GOLD-01 is in High Liquidity Class, Transca will be fund for your NFT</p>
        </div>
      </div>
    </div>
  );
};
export default NFTDefault;
