import Layout from "../components/layout"

export default function ApiExamplePage() {
  return (
    <Layout>
      <h1>PGP</h1>
      <p>/api/keys/pgp</p>
      <iframe src="/api/keys/pgp" />
    </Layout>
  )
}
