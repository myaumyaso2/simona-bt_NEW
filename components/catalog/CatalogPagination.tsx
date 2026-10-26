'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  SimonaIconChevronLeft,
  SimonaIconChevronRight,
} from '@/components/brand/SimonaIcons';

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  shownItems: number;
  basePath?: string;
  onPageChange: (page: number) => void;
  onLoadMore?: () => void;
}

type PageToken = number | 'ellipsis-start' | 'ellipsis-end';

function buildVisiblePages(current: number, total: number): PageToken[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, idx) => idx + 1);
  }

  const tokens: PageToken[] = [1];

  let start = Math.max(2, current - 1);
  let end = Math.min(total - 1, current + 1);

  if (current <= 3) {
    start = 2;
    end = 4;
  } else if (current >= total - 2) {
    start = total - 3;
    end = total - 1;
  }

  if (start > 2) {
    tokens.push('ellipsis-start');
  }

  for (let p = start; p <= end; p++) {
    tokens.push(p);
  }

  if (end < total - 1) {
    tokens.push('ellipsis-end');
  }

  tokens.push(total);
  return tokens;
}

export function CatalogPagination({
  currentPage,
  totalPages = 1,
  totalItems = 0,
  shownItems = 0,
  basePath,
  onPageChange,
  onLoadMore,
}: CatalogPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const effectivePath = basePath || pathname || '/catalog';

  const buildPageHref = (targetPage: number): string => {
    const params = new URLSearchParams();
    // Preserve SEO-relevant query parameters (brand, category) while omitting ephemeral tracking params
    const brand = searchParams.get('brand');
    const category = searchParams.get('category');
    const q = searchParams.get('q');

    if (brand) params.set('brand', brand);
    if (category) params.set('category', category);
    if (q) params.set('q', q);
    if (targetPage > 1) {
      params.set('page', String(targetPage));
    }

    const qs = params.toString();
    return qs ? `${effectivePath}?${qs}` : effectivePath;
  };

  const pageTokens = useMemo(
    () => buildVisiblePages(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetPage: number) => {
    // Allow Ctrl/Cmd/middle-click to open in a new tab naturally
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    if (targetPage >= 1 && targetPage <= totalPages && targetPage !== currentPage) {
      onPageChange(targetPage);
    }
  };

  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  return (
    <nav
      aria-label="Постраничная навигация каталога"
      className="pt-10 pb-6 flex flex-col items-center space-y-4"
    >
      {/* 1. Primary Next Page / Load More Action */}
      {currentPage < totalPages && onLoadMore && (
        <button
          type="button"
          onClick={onLoadMore}
          className="px-8 py-3 rounded-xl bg-[#1E2228] hover:bg-[#252A32] border border-simona-teal text-white text-xs font-bold tracking-wide transition-all duration-300 shadow-md shadow-simona-teal/10 hover:shadow-simona-teal/20 cursor-pointer"
        >
          Следующие 24 прибора
        </button>
      )}

      {/* 2. Items counter */}
      <span className="text-xs text-[#87888A] font-medium">
        Страница {currentPage} из {totalPages} • показано {shownItems} из {totalItems} приборов
      </span>

      {/* 3. Crawlable Numbered Pagination (<a href="?page=N">) */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
        {currentPage > 1 ? (
          <Link
            href={buildPageHref(prevPage)}
            onClick={(e) => handleLinkClick(e, prevPage)}
            aria-label="Предыдущая страница"
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/50 text-[#D7D9DB] hover:text-white transition"
          >
            <SimonaIconChevronLeft className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#16191D] border border-[#2B313A] text-[#87888A] opacity-30 select-none"
          >
            <SimonaIconChevronLeft className="w-3.5 h-3.5" />
          </span>
        )}

        {pageTokens.map((token) => {
          if (typeof token !== 'number') {
            return (
              <span
                key={token}
                className="text-xs text-[#87888A] px-1.5 font-mono select-none"
              >
                …
              </span>
            );
          }

          const isCurrent = currentPage === token;
          return (
            <Link
              key={token}
              href={buildPageHref(token)}
              onClick={(e) => handleLinkClick(e, token)}
              aria-current={isCurrent ? 'page' : undefined}
              className={`min-w-[36px] h-9 px-2.5 rounded-xl inline-flex items-center justify-center text-xs font-semibold transition ${
                isCurrent
                  ? 'bg-simona-teal text-white border border-simona-teal shadow-sm'
                  : 'bg-[#16191D] text-[#D7D9DB] border border-[#2B313A] hover:border-simona-teal/50 hover:text-white'
              }`}
            >
              {token}
            </Link>
          );
        })}

        {currentPage < totalPages ? (
          <Link
            href={buildPageHref(nextPage)}
            onClick={(e) => handleLinkClick(e, nextPage)}
            aria-label="Следующая страница"
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/50 text-[#D7D9DB] hover:text-white transition"
          >
            <SimonaIconChevronRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#16191D] border border-[#2B313A] text-[#87888A] opacity-30 select-none"
          >
            <SimonaIconChevronRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </nav>
  );
}
