import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atoms/Table';

type Column = { key: string; header: string };

export const ValuationTable = ({ columns, data }: { columns: Column[]; data: any[] }) => {
  return (
    <div className="border rounded">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key}>{c.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((c) => (
                <TableCell key={c.key}>{String(row[c.key] ?? '')}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};


