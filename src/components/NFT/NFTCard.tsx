const NFTCard: React.FC<{ nftImg: string }> = ({ nftImg }) => {
  return (
    <div className="nft-body">
      <div className="nft-container">
        <div className="card">
          <div className={`nft-front bg-cover bg-center`} style={{ backgroundImage: `url(${nftImg})` }}></div>
          <div className="nft-back">
            <h1>Back of Card</h1>
            <p>Additional info on the back of the card</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NFTCard;
