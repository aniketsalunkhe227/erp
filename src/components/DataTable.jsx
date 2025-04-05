"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, Filter, X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";

export default function DataTable({
  data,
  columns,
  searchable = [],
  filters = {},
  exportOptions = false,
  className = "",
  pagination = null,
  onPageChange = () => {}
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: null, direction: "asc" });
  const [filter, setFilter] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [localData, setLocalData] = useState(data);

  // Update local data when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleSort = (key) => {
    const newSort = {
      key,
      direction: sort.key === key && sort.direction === "asc" ? "desc" : "asc",
    };
    setSort(newSort);

    // If we have pagination, we need to request sorted data from the server
    if (pagination) {
      onPageChange({
        page: 1, // Reset to first page when sorting
        sort_by: newSort.key,
        sort_order: newSort.direction,
        search,
        ...filter
      });
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilter = { ...filter, [key]: value || null };
    setFilter(newFilter);

    if (pagination) {
      onPageChange({
        page: 1, // Reset to first page when filtering
        sort_by: sort.key,
        sort_order: sort.direction,
        search,
        ...newFilter
      });
    }
  };

  const handleSearch = (value) => {
    setSearch(value);

    if (pagination) {
      onPageChange({
        page: 1, // Reset to first page when searching
        sort_by: sort.key,
        sort_order: sort.direction,
        search: value,
        ...filter
      });
    }
  };

  const clearFilters = () => {
    setFilter({});
    setSearch("");
    setSort({ key: null, direction: "asc" });

    if (pagination) {
      onPageChange({
        page: 1,
        sort_by: null,
        sort_order: null,
        search: "",
        ...Object.keys(filters).reduce((acc, key) => ({ ...acc, [key]: null }), {})
      });
    }
  };

  const handlePageChange = (page) => {
    if (pagination) {
      onPageChange({
        page,
        sort_by: sort.key,
        sort_order: sort.direction,
        search,
        ...filter
      });
    }
  };

  // Client-side filtering/sorting when not using server pagination
  const processedData = pagination 
    ? localData 
    : localData
        .filter((item) => {
          if (!search) return true;
          return searchable.some((key) => 
            String(item[key]).toLowerCase().includes(search.toLowerCase())
          );
        })
        .filter((item) => {
          return Object.entries(filter).every(([key, value]) => 
            !value || item[key] === value
          );
        })
        .sort((a, b) => {
          if (!sort.key) return 0;
          const valA = a[sort.key];
          const valB = b[sort.key];
          return sort.direction === "asc" 
            ? (valA > valB ? 1 : -1) 
            : (valA < valB ? 1 : -1);
        });

  const handleExport = (type) => {
    const exportData = processedData.map(item => {
      const row = {};
      columns.forEach(col => {
        row[col.label] = col.render 
          ? col.render(item[col.key], item) 
          : item[col.key];
      });
      return row;
    });

    if (type === 'excel') {
      exportToExcel(exportData, 'orders');
    } else {
      exportToPDF(exportData, 'orders', columns);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden ${className}`}>
      {/* Table Controls */}
      <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none"
          />
        </div>

        {/* Export Buttons */}
        {exportOptions && (
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Download className="h-4 w-4" />
              Excel
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Download className="h-4 w-4" />
              PDF
            </button>
          </div>
        )}

        {/* Desktop Filters */}
        <div className="hidden sm:flex gap-2">
          {Object.entries(filters).map(([key, options]) => (
            <select
              key={key}
              value={filter[key] || ""}
              onChange={(e) => handleFilterChange(key, e.target.value || null)}
              className="p-2 border border-gray-200 dark:border-gray-800 rounded-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none text-sm"
            >
              <option value="">All {key}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ))}

          {(Object.values(filter).some(Boolean) || search) && (
            <button
              onClick={clearFilters}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="sm:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Mobile Filters Panel */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end sm:hidden">
          <div className="bg-white dark:bg-gray-900 w-4/5 h-full p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold dark:text-white">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(filters).map(([key, options]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <select
                    value={filter[key] || ""}
                    onChange={(e) => handleFilterChange(key, e.target.value || null)}
                    className="w-full p-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none"
                  >
                    <option value="">All {key}</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <button
                onClick={clearFilters}
                className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Clear All Filters
              </button>

              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 ${
                    col.sortable ? "cursor-pointer" : ""
                  }`}
                >
                  <div className="flex items-center">
                    {col.label}
                    {col.sortable && sort.key === col.key && (
                      sort.direction === "asc" ? (
                        <ChevronUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-1" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {processedData.length > 0 ? (
              processedData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="p-3 text-sm text-gray-900 dark:text-white">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{(pagination.current_page - 1) * pagination.per_page + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
            </span>{' '}
            of <span className="font-medium">{pagination.total}</span> results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={!pagination.has_prev}
              className={`p-2 rounded-full border ${pagination.has_prev ? 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800' : 'border-gray-100 dark:border-gray-800 opacity-50 cursor-not-allowed'}`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (pagination.total_pages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.current_page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.current_page >= pagination.total_pages - 2) {
                  pageNum = pagination.total_pages - 4 + i;
                } else {
                  pageNum = pagination.current_page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-full text-sm ${pagination.current_page === pageNum ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {pagination.total_pages > 5 && pagination.current_page < pagination.total_pages - 2 && (
                <>
                  <span className="px-1">...</span>
                  <button
                    onClick={() => handlePageChange(pagination.total_pages)}
                    className={`w-8 h-8 rounded-full text-sm ${pagination.current_page === pagination.total_pages ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    {pagination.total_pages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={!pagination.has_next}
              className={`p-2 rounded-full border ${pagination.has_next ? 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800' : 'border-gray-100 dark:border-gray-800 opacity-50 cursor-not-allowed'}`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}