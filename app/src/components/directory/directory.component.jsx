import { Link } from 'react-router-dom';
import CollectionCard from '../collection-card/collection-card.component';
import './directory.styles.scss';

const Directory = ({ collections }) => {
  return (
    <div>
      <h1>Collections</h1>
      <div className='collection-directory-container'>
        {collections.map((collection, index) => {
          return (
            <Link to={`/collection/${collection.id}`}>
              <CollectionCard
                id={collection.id}
                name={collection.name}
                images={collection.images}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Directory;
