import Layout from "../components/layout"

export default function ApiExamplePage() {
  return (
    <Layout>
      <h1>API Example</h1>
      <p>The keys below show responses from the API endpoints.</p>
      <p>
        <em>You must be signed in to see responses.</em>
      </p>
      <h2>PGP</h2>
      <p>/api/keys/pgp</p>
      <iframe src="/api/keys/pgp" />
      <h2>Session</h2>
      <p>/api/keys/session</p>
      <iframe src="/api/keys/session" />
      <h2>JSON Web Token</h2>
      <p>/api/keys/jwt</p>
      <iframe src="/api/keys/jwt" />
    </Layout>
  )
}
