import { RecoilRoot } from 'recoil'
import '../lib/firebase'
import '../styles/globals.scss'

import dayjs from 'dayjs'
import 'dayjs/locale/ja'

dayjs.locale('ja')

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
