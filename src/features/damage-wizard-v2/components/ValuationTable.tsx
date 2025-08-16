import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atoms/Table';

type Column = { key: string; header: string };

type ValuationTableProps = {
  columns: Column[];
  data: any[];
};

export const ValuationTable = ({ columns, data }: ValuationTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};