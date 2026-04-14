import { useRouter } from "next/router";
import Navbar from "../navbar";
const disableNavbar = ["/auth/login", "/auth/register"];

type AppShellProps = {
  children: React.ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
  const { pathname } = useRouter();

  return (
    <main>
      {!disableNavbar.includes(pathname) && <Navbar />}
      {children}
    </main>
  );
};

export default AppShell;
