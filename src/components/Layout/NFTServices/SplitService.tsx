import Button from "../../Button/Button";
import Message from "../../Message/Message";

const SplitService: React.FC = () => {
  return (
    <div className="bg-white flex-1 border border-none rounded-xl shadow-xl">
      <h3 className="text-center my-4 font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">Split Your NFT</h3>
      <div className="w-full mx-auto">
        <img src="/icons/split-nft.jpeg" className="mx-auto max-w-[280px] max-h-[280px]" alt="" />
      </div>
      <div className="mx-4 my-4">
        <Message
          className={"space-x-2"}
          title={"Split"}
          content={
            "NFT Split is also a solution that enables users to divide their NFTs into several parts and use them in DeFi activities. For instance, if a user deposits 5 grams of gold into the vault, how can they use just one gram of gold for DeFi activities? NFT Split addresses this issue. When the user wants to reclaim the original RWA NFT, they can take it from the pieces that were split initially. As a result, this feature allows the user to retrieve the original NFT. "
          }
        />
      </div>
      <div className="flex space-x-4 justify-center items-center my-4">
        <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]" disabled={true}>
          Comming Soon
        </Button>
      </div>
    </div>
  );
};
export default SplitService;
