import {
  Pagination as PaginationShad,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface CustomPaginationProps {
  page: number;
  onChange: (page: number) => void;
  total: number;
  limit: number;
}

const Pagination = ({
  page,
  onChange,
  total,
  limit,
}: CustomPaginationProps) => {
  const maxNumbers = 9;

  const totalPages = Math.ceil(total / limit);

  const getPages = () => {
    if (totalPages <= maxNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 4) {
      return Array.from({ length: maxNumbers }, (_, i) => i + 1);
    }

    let end = page + (maxNumbers - 5);
    if (end > totalPages) {
      end = totalPages;
    }

    let start = end - maxNumbers + 1;
    if (start < 1) start = 1;

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    totalPages > 0 && (
      <PaginationShad>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              isDisabled={page === 1}
              onClick={() => onChange(page - 1)}
            />
          </PaginationItem>
          {getPages().map((number) => (
            <PaginationItem key={number}>
              <PaginationLink
                onClick={() => onChange(number)}
                isActive={page === number}
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              isDisabled={page === totalPages}
              onClick={() => onChange(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationShad>
    )
  );
};

export default Pagination;
