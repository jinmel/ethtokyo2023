import { useParams, Link } from 'react-router-dom';
import './collection-stats.styles.scss';

const CollectionStats = ({ collection }) => {
  const { collectionId } = useParams();

  return (
    <div className='collection-stats-container'>
      <img src={`${collection.images[0]}`} />
      <p>Placeholder</p>
      <p>Placeholder</p>
      <p>Placeholder</p>
 
    </div>
  );
};

export default CollectionStats;
