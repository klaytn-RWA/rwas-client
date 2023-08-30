import { ArrowBack } from "@styled-icons/boxicons-regular";
import Header from "../../Header/Header";

const Borrow: React.FC<{}> = () => {
  return (
    <>
      <Header />
      <div className="p-4 md:ml-64 mt-14 bg-gray-100 h-screen">
        <h2 className="w-fit bg-white border border-none rounded-xl px-6 py-1 my-4 flex justify-center items-center space-x-2 cursor-pointer">
          <ArrowBack size={24} />
          <div className="text-[18px] font-bold">Borrow</div>
        </h2>
      </div>
    </>
  );
};
export default Borrow;
