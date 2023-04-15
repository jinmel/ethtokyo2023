import { Link } from 'react-router-dom';
import CollectionCard from '../collection-card/collection-card.component';
import './directory.styles.scss';
import { useWalletLogin } from '@lens-protocol/react-web';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useWalletLogout, useActiveWallet } from '@lens-protocol/react-web';
import { WhenLoggedInWithProfile } from '../WhenLoggedInWithProfile';
import { PostForm } from '../PostForm';
import { profileId, usePublications } from '@lens-protocol/react-web';
import { useActiveProfile } from '@lens-protocol/react-web';

const demoProfileId = '0x01c71a';

function MyProfile() {
  const { data, error, loading } = useActiveProfile();

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  if (data === null) return <p>No active profile</p>;

  return (
    <div>
      <p>Active profile: @{data.handle}</p>
    </div>
  );
}

function LogoutButton() {
  const { execute: logout, isPending } = useWalletLogout();

  return (
    <button disabled={isPending} onClick={logout}>
      Log out
    </button>
  );
}

function LoginButton() {
  const {
    execute: login,
    error: loginError,
    isPending: isLoginPending,
  } = useWalletLogin();

  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
      const signer = await connector.getSigner();
      await login(signer);
    }
  };

  return (
    <div>
      {loginError && <p>{loginError}</p>}
      <button disabled={isLoginPending} onClick={onLoginClick}>
        Log in
      </button>
    </div>
  );
}

function WalletStatus() {
  const { data: wallet, loading } = useActiveWallet();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (wallet) {
    return (
      <>
        <p>You are logged-in with {wallet.address}</p>
        <MyProfile />
      </>
    );
  }
}

function Publications() {
  const {
    data: publication,
    loading,
    hasMore,
    next,
  } = usePublications({
    profileId: demoProfileId,
    limit: 10,
  });

  console.log(publication);

  return <div></div>;
}

const Directory = ({ collections }) => {
  return (
    <div>
      <h1>Model Publications</h1>
      <WalletStatus />
      <LoginButton />
      <LogoutButton />
      <WhenLoggedInWithProfile>
        {({ profile }) => (
          <>
            <PostForm publisher={profile} />
          </>
        )}
      </WhenLoggedInWithProfile>
      <div className="collection-directory-container">
        <Publications />
        {collections.map((collection, index) => {
          return (
            <Link to={`/collection/${collection.id}`}>
              <CollectionCard
                key={index}
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
