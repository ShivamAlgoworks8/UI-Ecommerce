import "./pagination.css";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getPages = () => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="common-pagination-wrapper">
      <div className="common-pagination">
        <button
          className="common-pagination-nav"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span>‹</span>
          Previous
        </button>

        <div className="common-pagination-pages">
          {getPages().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="common-pagination-ellipsis"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                className={`common-pagination-page ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          className="common-pagination-nav"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <span>›</span>
        </button>
      </div>
    </div>
  );
}

export default Pagination;