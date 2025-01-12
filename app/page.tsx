import { auth } from "@/utils/auth";
import PaymentForm from './../components/PaymentForm';

export default async function Home() {

  const session = await auth()

  return (
    <div>
      {/* {session ? (
        <div>
          <PaymentForm />
        </div>
      ) : (
        <>
          <h1>Not signed in</h1>
        </>
      )} */}
      <PaymentForm />
    </div>
  );
}
