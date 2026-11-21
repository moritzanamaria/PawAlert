import useLoading from '../hooks/useLoading';
import BrandMark from './BrandMark';

export default function LoadingSpinner() {
  const { loading } = useLoading();

  return (
    <>
      {loading && (
        <div className='loading-spinner-overlay' role='status' aria-live='polite'>
          <div className='pa-loader'>
            <div className='pa-loader-krug'>
              <span className='pa-loader-sapa'><BrandMark size={30} valovi={false} /></span>            </div>
            <span className='pa-loader-tekst'>Učitavanje…</span>
          </div>
        </div>
      )}
    </>
  );
}