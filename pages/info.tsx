import Layout from "../components/layout"
import type { GetServerSidePropsContext } from "next"

export default function ServerSidePage() {
  return (
    <Layout>
      <h1>Info</h1>
      <p>/api/info</p>
      <iframe src="/api/info" />
    </Layout>
  )
}