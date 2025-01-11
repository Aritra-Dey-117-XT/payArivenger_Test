import { auth } from "@/utils/auth";

export default async function Home() {

  const session = await auth()

  return (
    <div>
      {session ? (
        <>
          <h1>User Information</h1>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </>
      ) : (
        <>
          <h1>Not signed in</h1>
        </>
      )}
    </div>
  );
}
