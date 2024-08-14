import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Constraints() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Constraints</CardTitle>
        <CardDescription>
          Require diets to meet certain constraints when using this profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Constraint</TableHead>
              <TableHead className="text-center">Comparison</TableHead>
              <TableHead className="text-right">Reference Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Crude Protein</TableCell>
              <TableCell className="text-center">&gt;</TableCell>
              <TableCell className="text-right">20%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Net Enegery</TableCell>
              <TableCell className="text-center">&gt;</TableCell>
              <TableCell className="text-right">10%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
