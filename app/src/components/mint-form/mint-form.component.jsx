import { useParams, Link } from 'react-router-dom';
import './mint-form.styles.scss';

const MintForm = ({}) => {
  const { collectionId } = useParams();

  return (
    <div className='mint-form'>
      <Link to={`/collection/${collectionId}`}>
        <button className='go-back-btn'>Go Back</button>
      </Link>
      <h1>NAME OF COLLECTION</h1>
      <div className='mint-flex-container'>
        <form className='mint-new-nft'>
          <div className='input-prompts'>
            <label htmlFor='imagePrompt'>Prompt</label>
            <textarea
              type='text'
              name='imagePrompt'
              placeholder='Write image prompt...'
              required
            />
            <label htmlFor='imageNegativePrompt'>Exclusion Prompt</label>
            <textarea
              type='text'
              name='imageNegativePrompt'
              placeholder='Exclude...'
              required
            />
            <button className='generate-image'>Generate</button>
          </div>
          <button type='submit'>Mint NFT</button>
        </form>
        <div className='mint-image-container'>
          <img src='https://i.ibb.co/T1VFYmw/00024-965785759.jpg' />
        </div>
      </div>
    </div>
  );
};

export default MintForm;
