import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import NftCard from '../../components/NFT-card/NFT-card.component';
import Popup from '../../components/popup/popup.component';
import './collection.styles.scss';

const Collection = ({ collections }) => {
  const [popupToggle, setPopupToggle] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const { collectionId } = useParams();

  let collection = collections.filter((element) => element.id == collectionId);
  return (
    <div className='collection-container'>
      <Link to={`/`}>
        <button className='go-back-btn'>Go Back</button>
      </Link>
      <h1 className='collection-name'>{collection[0].name}</h1>
      <div className='collection-mint-btn'>
        <Link to={`/collection/${collectionId}/mint`}>
          <button>Mint</button>
        </Link>
      </div>
      <div className='nft-images-container'>
        <NftCard
          collection={collection}
          setPopupToggle={setPopupToggle}
          setSelectedImage={setSelectedImage}
        />
      </div>
      {popupToggle && (
        <Popup
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </div>
  );
};

export default Collection;
