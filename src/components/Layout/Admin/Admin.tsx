import HeaderAdmin from "../../Header/HeaderAdmin";

const Admin: React.FC<{}> = () => {
  return (
    <>
      <HeaderAdmin />

      <div className="p-4 md:ml-64 mt-14 bg-gray-100 h-screen">
        <div className="bg-white px-4 py-4 border border-none rounded-xl flex flex-col lg:flex-row justify-between items-center space-x-4">
          <div>admin</div>
        </div>
      </div>
    </>
  );
};

export default Admin;
