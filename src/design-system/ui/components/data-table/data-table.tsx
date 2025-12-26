"use client"

import type React from "react"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp, ChevronsUpDown, Filter, X, Search } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/design-system/ui/base/table"
import { Input } from "@/design-system/ui/base/input"
import { Button } from "@/design-system/ui/base/button"
import { DataTablePagination } from "./data-table-pagination"
import { cn } from "@/core/utils/cn"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/design-system/ui/base/dropdown-menu"
import { Badge } from "@/design-system/ui/base/badge"
import { ExpandableRow } from "./expandable-row"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  showSearch?: boolean
  showPagination?: boolean
  showColumnToggle?: boolean
  showFilters?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  className?: string
  onRowClick?: (row: TData) => void
  isLoading?: boolean
  noResultsMessage?: string
  filterableColumns?: {
    id: string
    title: string
    options: { label: string; value: string }[]
  }[]
  expandable?: boolean
  renderExpandedContent?: (row: TData) => React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  showSearch = true,
  showPagination = true,
  showColumnToggle = false,
  showFilters = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  className,
  onRowClick,
  isLoading = false,
  noResultsMessage = "No results found.",
  filterableColumns = [],
  expandable = false,
  renderExpandedContent,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchValue, setSearchValue] = useState("")

  // Apply search filter when searchValue changes
  const handleSearch = (value: string) => {
    setSearchValue(value)
    if (searchKey) {
      setColumnFilters((prev) => {
        const existing = prev.filter((filter) => filter.id !== searchKey)
        return value ? [...existing, { id: searchKey, value }] : existing
      })
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  })

  // Clear all filters
  const clearFilters = () => {
    setColumnFilters([])
    setSearchValue("")
  }

  // Get active filters count
  const activeFiltersCount = columnFilters.length

  return (
    <div className={cn(className)}>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        {/* {showSearch && searchKey && (
          <div className="relative max-w-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12"
            />
            {searchValue && (
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => handleSearch("")}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )} */}

        <div className="flex items-center gap-2 ml-auto">
          {showFilters && filterableColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 h-9">
                  <Filter className="w-4 h-4" />
                  Filter
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="px-1 ml-1 rounded-full">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {filterableColumns.map((column) => (
                  <DropdownMenuItem key={column.id} className="flex flex-col items-start w-full">
                    <div className="mb-1 font-medium">{column.title}</div>
                    <div className="flex flex-wrap w-full gap-1">
                      {column.options.map((option) => {
                        const isActive = columnFilters.some(
                          (filter) => filter.id === column.id && filter.value === option.value,
                        )
                        return (
                          <Badge
                            key={option.value}
                            variant={isActive ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              if (isActive) {
                                setColumnFilters((prev) =>
                                  prev.filter((filter) => !(filter.id === column.id && filter.value === option.value)),
                                )
                              } else {
                                setColumnFilters((prev) => [...prev, { id: column.id, value: option.value }])
                              }
                            }}
                          >
                            {option.label}
                          </Badge>
                        )
                      })}
                    </div>
                  </DropdownMenuItem>
                ))}
                {activeFiltersCount > 0 && (
                  <DropdownMenuItem
                    className="flex justify-center mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={clearFilters}
                  >
                    Clear all filters
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {showColumnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuItem
                        key={column.id}
                        className="capitalize"
                        onClick={() => column.toggleVisibility(!column.getIsVisible())}
                      >
                        <input
                          type="checkbox"
                          checked={column.getIsVisible()}
                          onChange={() => column.toggleVisibility(!column.getIsVisible())}
                          className="mr-2"
                        />
                        {column.id}
                      </DropdownMenuItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="overflow-hidden bg-white rounded-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                        <TableHead key={header.id} className='text-sm font-medium text-primary-300 capitalize'>
                            {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                <div
                                    className='flex items-center gap-1 cursor-pointer group'
                                    onClick={header.column.getToggleSortingHandler()}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {{
                                        asc: <ChevronUp className='w-4 h-4' />,
                                        desc: <ChevronDown className='w-4 h-4' />
                                    }[header.column.getIsSorted() as string] ?? (
                                        <ChevronsUpDown className='w-4 h-4 opacity-0 group-hover:opacity-50' />
                                    )}
                                </div>
                            ) : (
                                flexRender(header.column.columnDef.header, header.getContext())
                            )}
                        </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`loading-${i}`}>
                    {Array.from({ length: columns.length }).map((_, j) => (
                      <TableCell key={`loading-cell-${i}-${j}`}>
                        <div className="h-6 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  if (expandable && renderExpandedContent) {
                    return (
                      <ExpandableRow key={row.id} expandedContent={renderExpandedContent(row.original)}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </ExpandableRow>
                    )
                  }

                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={onRowClick ? "cursor-pointer" : ""}
                      onClick={() => onRowClick && onRowClick(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {noResultsMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {showPagination && <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />}
    </div>
  )
} 