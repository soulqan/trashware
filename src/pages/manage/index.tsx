import ManageView from '@/views/manage';
import Head from 'next/head';

export default function ManagePage() {
  return (
    <>
      <Head>
        <title>Manage Bin | Trashware Monitoring</title>
      </Head>
      <ManageView />
    </>
  );
}