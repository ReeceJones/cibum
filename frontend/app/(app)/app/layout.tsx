import { AppNavigationMenu } from "@/components/ui/app-navigation.menu";
import "./globals.css";
import { QueryProvider } from "./query-provider";

export default function DefualtAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div>
        <AppNavigationMenu />
        <div className="py-4 container">{children}</div>
      </div>
    </QueryProvider>
  );
}
