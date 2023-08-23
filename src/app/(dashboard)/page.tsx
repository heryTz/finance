import { AdminGuard } from "../guards";

function Component() {
  return <main>TODO: dashboard</main>;
}

export default function Home(props: {}) {
  return (
    <AdminGuard>
      <Component {...props} />
    </AdminGuard>
  );
}
