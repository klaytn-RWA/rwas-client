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
          title={"Bundle"}
          content={
            "This is a solution that allows users to combine multiple RWAs NFTs into a single package - a unique RWAs NFT which has an overall value equal to the sum of the individual RWA NFT's values. The purpose of this is to create a NFTs package and minimize the number of transactions that users need to make when using RWA NFTs in financial platforms. Furthermore, users can take the advantage of adjusting the number of NFTs used to generate the package and putting it into an RWA NFT Bundle."
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
