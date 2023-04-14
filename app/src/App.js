import './App.scss';
import Directory from './components/directory/directory.component';
import MintingForm from './components/mint-form/mint-form.component';
import Collection from './pages/collection/collection.component';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Wallet from './components/wallet/wallet.component';

const collections = [
  {
    id: 1,
    name: 'Pokemon',
    images: [
      'https://i.ibb.co/dpGdj3b/216947.png',
      'https://i.ibb.co/BKddQYG/216949.png',
      'https://i.ibb.co/kc9RRk4/216950.png',
      'https://i.ibb.co/23h2JFN/216951.png',
      'https://i.ibb.co/9t781dZ/216952.png',
    ],
  },
  {
    id: 2,
    name: 'One Piece',
    images: [
      'https://i.ibb.co/Rp1B0YS/13678-2776295943-1boy-wanostyle-monkey-d-luffy-angry-looking-straw-hat-looking-at-viewer-solo-upper.png',
      'https://i.ibb.co/FWsFdVM/13790-2444509273-1girl-wanostyle-white-hair-fire-a-girl-with-white-hair-and-blue-eyes-wearing-a-whit.png',
      'https://i.ibb.co/tpf4W14/13815-722196953-1girl-wanostyle-white-hair-hime-cut-bangs-fire-a-girl-with-white-hair-and-blue-eyes.png',
      'https://i.ibb.co/9ytWqdx/13936-3906664986-1girl-yamato-5000-white-hair-green-hair-gradient-hair-horns-wanostyle-ring-earrings.png',
      'https://i.ibb.co/zn8VQhP/00434-637315696-1boy-wanostyle-monkey-d-luffy-smiling-straw-hat-looking-at-viewer-solo-upper-body-ma.png',
    ],
  },
  {
    id: 3,
    name: 'Chainsaw Man',
    images: [
      'https://i.ibb.co/fkfM9wG/00001-1960385216.jpg',
      'https://i.ibb.co/c6vHSN8/00012-4191268523.jpg',
      'https://i.ibb.co/wKXndsB/00019-997367550.jpg',
      'https://i.ibb.co/T1VFYmw/00024-965785759.jpg',
      'https://i.ibb.co/wz4bHqy/00049-317457178.jpg',
    ],
  },
];

function App() {
  return (
    <div className='App'>
      <Wallet />
      <Router>
        <Routes>
          <Route path='/' element={<Directory collections={collections} />} />
          <Route
            path='/collection/:collectionId/mint'
            element={<MintingForm />}
          />
          <Route
            path='/collection/:collectionId'
            element={<Collection collections={collections} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
