"use client";

type TableProps = {
  headers: string[];
  rows: string[][];
};

export default function TableComponent({ headers, rows }: TableProps) {
  return (
    <div className="overflow-auto my-4">
      <table className="min-w-full border border-gray-300 text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-4 py-2 border">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-4 py-2 border">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
