"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Search,
  X,
} from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Input } from "./input";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Field, FieldContent, FieldLabel } from "./field";
import { DatePicker } from "./date-picker";

interface CategoryOption {
  label: string;
  value: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  categoryOptions?: CategoryOption[];
}

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { value: "HOUSING", label: "Moradia" },
  { value: "TRANSPORTATION", label: "Transporte" },
  { value: "FOOD", label: "Alimentação" },
  { value: "ENTERTAINMENT", label: "Entretenimento" },
  { value: "HEALTH", label: "Saúde" },
  { value: "UTILITY", label: "Utilidades" },
  { value: "SALARY", label: "Salário" },
  { value: "EDUCATION", label: "Educação" },
  { value: "OTHER", label: "Outros" },
];

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey = "name",
  searchPlaceholder = "Buscar transação pelo nome...",
  categoryOptions = DEFAULT_CATEGORIES,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [dateRange, setDateRange] = React.useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleDateChange = (type: "from" | "to", value: string) => {
    const updatedRange = { ...dateRange, [type]: value };
    setDateRange(updatedRange);

    if (!updatedRange.from && !updatedRange.to) {
      table.getColumn("date")?.setFilterValue(undefined);
    } else {
      table.getColumn("date")?.setFilterValue([updatedRange.from, updatedRange.to]);
    }
  };

  const handleClearFilters = () => {
    table.resetColumnFilters();
    setDateRange({ from: "", to: "" });
  };

  const handleExportCSV = () => {
    const filteredRows = table.getFilteredRowModel().rows;
    if (!filteredRows.length) return;

    const headers = ["Nome", "Tipo", "Categoria", "Método", "Data", "Valor"];

    const csvRows = filteredRows.map((row) => {
      const item = row.original as Record<string, unknown>;
      const formattedDate = item.date
        ? new Date(String(item.date)).toLocaleDateString("pt-BR")
        : "";
      const formattedAmount =
        item.amount !== undefined ? Number(item.amount).toFixed(2).replace(".", ",") : "0,00";

      return [
        `"${String(item.name ?? "").replace(/"/g, '""')}"`,
        `"${String(item.type ?? "")}"`,
        `"${String(item.category ?? "")}"`,
        `"${String(item.paymentMethod ?? "")}"`,
        `"${formattedDate}"`,
        `"${formattedAmount}"`,
      ].join(";");
    });

    const csvString = "\uFEFF" + [headers.join(";"), ...csvRows].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `transacoes-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters = columnFilters.length > 0;

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <div className="bg-card border-muted-foreground/12 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-60 flex-1 sm:max-w-xs">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
              className="pl-9"
            />
          </div>

          {table.getColumn("category") && (
            <Select
              value={(table.getColumn("category")?.getFilterValue() as string) ?? "ALL"}
              onValueChange={(value) =>
                table.getColumn("category")?.setFilterValue(value === "ALL" ? undefined : value)
              }
            >
              <SelectTrigger className="text-muted-foreground w-45">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas as categorias</SelectItem>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {table.getColumn("date") && (
            <div className="flex items-center gap-2">
              <DatePicker
                date={
                  dateRange.from
                    ? new Date(`${dateRange.from}T00:00:00`)
                    : (undefined as unknown as Date)
                }
                onDateChange={(date) =>
                  handleDateChange("from", date ? date.toLocaleDateString("en-CA") : "")
                }
              />
              <span className="text-muted-foreground text-xs">até</span>
              <DatePicker
                date={
                  dateRange.to
                    ? new Date(`${dateRange.to}T00:00:00`)
                    : (undefined as unknown as Date)
                }
                onDateChange={(date) =>
                  handleDateChange("to", date ? date.toLocaleDateString("en-CA") : "")
                }
              />
            </div>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="text-muted-foreground hover:text-foreground h-9 px-2.5 text-xs"
            >
              Limpar
              <X className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          onClick={handleExportCSV}
          disabled={table.getFilteredRowModel().rows.length === 0}
          className="cursor-pointer gap-2 rounded-sm"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="bg-card border-muted-foreground/12 h-full flex-1 overflow-hidden rounded-lg border shadow-2xl">
        <Table>
          <TableHeader className="bg-background/90">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-muted-foreground/12 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-muted-foreground px-6 py-4 text-xs font-extrabold tracking-wider uppercase"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-muted-foreground/8 hover:bg-muted/20 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-muted-foreground px-6 py-4 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-32 text-center text-sm"
                >
                  Nenhuma transação encontrada para os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="border-muted-foreground/12 flex flex-wrap items-center justify-between gap-4 border-t px-6 py-4">
          <div className="text-muted-foreground text-xs">
            Mostrando{" "}
            <span className="text-foreground font-medium">{table.getRowModel().rows.length}</span>{" "}
            de{" "}
            <span className="text-foreground font-medium">
              {table.getFilteredRowModel().rows.length}
            </span>{" "}
            transações
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">Linhas por página</span>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-17.5 text-xs">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-muted-foreground text-xs font-medium">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
