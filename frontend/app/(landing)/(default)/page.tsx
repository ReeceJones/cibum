import { Button } from "@/components/ui/button";
import { IconGrain } from "@tabler/icons-react";

export default function Home() {
  return (
    <main className="p-10">
      <div>
        <h1 className="font-bold italic flex items-center space-x-2">
          <span>CIBUM</span> <IconGrain size={18} />
        </h1>
        <p>coming soon...</p>
      </div>
      <div className="float-right">
        <Button variant="link">...Join Waitlist</Button>
      </div>
    </main>
  );
}
