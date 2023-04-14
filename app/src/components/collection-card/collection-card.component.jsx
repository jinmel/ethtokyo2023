import './collection-card.styles.scss';

const CollectionCard = ({ id, name, images }) => {
  return (
    <div className='collection-card'>
      <p>{name}</p>
      <img src={images[0]}></img>
    </div>
  );
};

export default CollectionCard;
