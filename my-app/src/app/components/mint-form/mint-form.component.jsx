/* eslint-disable */
import { useParams, Link } from 'react-router-dom';
import './mint-form.styles.scss';
import { useState } from 'react';

const MintForm = ({}) => {
  const { collectionId } = useParams();
  const [complete, setComplete] = useState(false);

  const onClick = () => {
    setComplete(true);
  };

  return (
    <div className="mint-form">
      <Link to={`/collection/${collectionId}`}>
        <button className="go-back-btn">Go Back</button>
      </Link>
      <h1>Fakemon</h1>
      <div className="mint-flex-container">
        <form className="mint-new-nft">
          <div className="input-prompts">
            <label htmlFor="imagePrompt">Prompt</label>
            <textarea
              type="text"
              name="imagePrompt"
              placeholder="Write image prompt..."
              required
            />
            <label htmlFor="imageNegativePrompt">Exclusion Prompt</label>
            <textarea
              type="text"
              name="imageNegativePrompt"
              placeholder="Exclude..."
              required
            />
            <button className="generate-image" onClick={onClick}>
              Generate
            </button>
          </div>
          <button type="submit">Collect NFT</button>
        </form>
        <div className="mint-image-container">
          {complete ? (
            <img src="https://i.ibb.co/dpGdj3b/216947.png" />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default MintForm;
