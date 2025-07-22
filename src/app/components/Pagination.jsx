import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = '' 
}) {
  const generatePageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 7) {
      // Nếu tổng số trang <= 7, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic phức tạp cho nhiều trang
      if (currentPage <= 3) {
        // Trang 1, 2, 3: hiển thị 1, 2, 3, 4, ..., totalPages
        pages.push(1, 2, 3, 4);
        if (totalPages > 5) {
          pages.push('...');
        }
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Gần cuối: 1, ..., totalPages-3, totalPages-2, totalPages-1, totalPages
        pages.push(1);
        if (totalPages > 5) {
          pages.push('...');
        }
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Ở giữa: 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (    <div className={`flex justify-center items-center gap-2 ${className}`}>
      {/* Previous button */}      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-2 border-2 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 disabled:opacity-50"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Trước</span>
      </Button>
      
      {/* Page numbers */}
      <div className="flex gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span 
                key={`ellipsis-${index}`} 
                className="px-3 py-2 text-muted-foreground"
              >
                ...
              </span>
            );
          }
            return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`min-w-[40px] border-2 ${
                currentPage === page 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700' 
                  : 'border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400'
              }`}
            >
              {page}
            </Button>
          );
        })}
      </div>
        {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 border-2 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 disabled:opacity-50"
      >
        <span className="hidden sm:inline">Sau</span>
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
