import { AppNavigationMenu } from "@/components/ui/app-navigation.menu";
import "./globals.css";
import { QueryProvider } from "./query-provider";
import { IconAlertTriangleFilled } from "@tabler/icons-react";

export default function DefualtAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div>
        <div className="w-full h-8 bg-orange-400 text-sm flex items-center italic font-medium">
          <div className="container flex items-center space-x-2">
            <IconAlertTriangleFilled size={16} />
            <span>
              Cibum is in test mode. Your data may be deleted at any time
              without notice.
            </span>
          </div>
        </div>
        <AppNavigationMenu />
        <div className="py-4 container">{children}</div>
      </div>
    </QueryProvider>
  );
}
