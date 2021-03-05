import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { toast } from 'react-toastify';
import Layout from '../../components/Layout'
import { User } from '../../models/User'

type Query = {
  uid: string
}

export default function UserShow() {
  const [user, setUser] = useState<User>(null)
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
      const doc = await firebase
        .firestore()
        .collection('users')
        .doc(query.uid)
        .get()

      if (!doc.exists) {
        return
      }

      const gotUser = doc.data() as User
      gotUser.uid = doc.id
      setUser(gotUser)
    }
    loadUser()
  }, [query.uid])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsSending(true)

    await firebase.firestore().collection('questions').add({
      senderUid: firebase.auth().currentUser.uid,
      receiverUid: user.uid,
      body,
      isReplied: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
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
      {user && (
        <div className="text-center">
          <h1 className="h4">{user.name}さんのページ</h1>
          <div className="m-5">{user.name}さんに質問しよう！</div>
        </div>
      )}
      <div className="row justify-content-center mb-3">
        <div className="col-12 col-md-6">
          <form onSubmit={onSubmit}>
            <textarea
              className="form-control"
              placeholder="おげんきですか？"
              rows={6}
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
        </div>
      </div>
    </Layout>
  )
}
