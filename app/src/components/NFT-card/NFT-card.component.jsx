import './NTF-card.styles.scss';

const NftCard = ({ collection, setPopupToggle, setSelectedImage }) => {
  return (
    <div className='nft-image-container'>
      {collection[0].images.map((image) => {
        return (
          <img
            src={`${image}`}
            onClick={() => {
              setPopupToggle(true);
              setSelectedImage(image);
            }}
          ></img>
        );
      })}
    </div>
  );
};

export default NftCard;
