import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import firebase from 'firebase/app'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
} from 'firebase/firestore'
import { toast } from 'react-toastify';
import Layout from '../../components/Layout'
import { User } from '../../models/User'
import { useAuthentication } from '../../hooks/authentication'

type Query = {
  uid: string
}

export default function UserShow() {
  const [user, setUser] = useState<User>(null)
  const { user: currentUser } = useAuthentication()
  const [body, setBody] = useState('')
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()
  const query = router.query as Query

  useEffect(() => {
    // 初回レンダリングの場合は query の値が存在しないので、その考慮
    if (query.uid === undefined) {
      return
    }
    async function loadUser() {
      const db = getFirestore()
      const ref = doc(collection(db, 'users'), query.uid)
      const userDoc = await getDoc(ref)

      if (!userDoc.exists()) {
        return
      }

      const gotUser = userDoc.data() as User
      gotUser.uid = userDoc.id
      setUser(gotUser)
    }
    loadUser()
  }, [query.uid])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const db = getFirestore()

    setIsSending(true)

    await addDoc(collection(db, 'questions'), {
      senderUid: currentUser.uid,
      receiverUid: user.uid,
      body,
      isReplied: false,
      createdAt: serverTimestamp(),
    })

    setIsSending(false)

    setBody('')
    toast.success('質問を送信しました。', {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  return (
    <Layout>
      {user && currentUser && (
        <div className="text-center">
          <h1 className="h4">{user.name}さんのページ</h1>
          <div className="m-5">{user.name}さんに質問しよう！</div>
        </div>
      )}
      <div className="row justify-content-center mb-3">
        <div className="col-12 col-md-6">
          {user && user.uid === currentUser.uid ? (
            <div className="text-center">自分には送信できません。</div>
          ) : (
            <form onSubmit={onSubmit}>
              <textarea
                className="form-control"
                placeholder="おげんきですか？"
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              ></textarea>
              <div className="m-3">
                {isSending ? (
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    質問を送信する
                  </button>
                )}
              </div>
            </form>
          )}
          <div>
            {user && (
              <p className="text-center">
                <Link href="/users/me">
                  <a className="btn btn-link">自分もみんなに質問してもらおう！</a>
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
