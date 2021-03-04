import { RecoilRoot } from 'recoil'
import '../lib/firebase'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
