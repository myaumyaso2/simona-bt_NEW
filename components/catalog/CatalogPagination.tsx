'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  shownItems: number;
  onPageChange: (page: number) => void;
  onLoadMore?: () => void;
}

export function CatalogPagination({
  currentPage,
  totalPages = 18,
  totalItems = 420,
  shownItems = 24,
  onPageChange,
  onLoadMore,
}: CatalogPaginationProps) {
  return (
    <div className="pt-10 pb-6 flex flex-col items-center space-y-4">
      {/* 1. Primary Load More Button */}
      <button
        onClick={onLoadMore}
        className="px-8 py-3 rounded-xl bg-[#16191D] hover:bg-[#1E2228] border border-simona-teal text-white text-xs font-bold tracking-wide transition-all duration-300 shadow-md shadow-simona-teal/10 hover:shadow-simona-teal/20 active:scale-98"
      >
        Показать ещё 24 прибора
      </button>

      {/* 2. Items counter */}
      <span className="text-xs text-[#87888A] font-medium">
        Показано {shownItems} из {totalItems} приборов
      </span>

      {/* 3. Numbered Pagination */}
      <div className="flex items-center space-x-1.5 pt-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          aria-label="Предыдущая страница"
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#16191D] border border-[#2B313A] text-[#87888A] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {[1, 2, 3].map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
              currentPage === page
                ? 'bg-simona-teal text-white border border-simona-teal shadow-sm'
                : 'bg-[#16191D] text-[#D7D9DB] border border-[#2B313A] hover:border-simona-teal/50'
            }`}
          >
            {page}
          </button>
        ))}

        <span className="text-xs text-[#87888A] px-1 font-mono">...</span>

        <button
          onClick={() => onPageChange(totalPages)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
            currentPage === totalPages
              ? 'bg-simona-teal text-white border border-simona-teal shadow-sm'
              : 'bg-[#16191D] text-[#D7D9DB] border border-[#2B313A] hover:border-simona-teal/50'
          }`}
        >
          {totalPages}
        </button>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          aria-label="Следующая страница"
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#16191D] border border-[#2B313A] text-[#87888A] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
