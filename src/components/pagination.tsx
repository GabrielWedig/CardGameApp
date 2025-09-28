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
  qtdPages: number;
}

const Pagination = ({ page, onChange, qtdPages }: CustomPaginationProps) => {
  const maxNumbers = 9;

  const getPages = () => {
    if (qtdPages <= maxNumbers) {
      return Array.from({ length: qtdPages }, (_, i) => i + 1);
    }

    if (page <= 4) {
      return Array.from({ length: maxNumbers }, (_, i) => i + 1);
    }

    let end = page + (maxNumbers - 5);
    if (end > qtdPages) {
      end = qtdPages;
    }

    let start = end - maxNumbers + 1;
    if (start < 1) start = 1;

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <PaginationShad>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            isDisabled={page === 1}
            onClick={() => onChange(page - 1)}
          />
        </PaginationItem>
        <PaginationItem>
          {getPages().map((number) => (
            <PaginationLink
              key={number}
              onClick={() => onChange(number)}
              isActive={page === number}
            >
              {number}
            </PaginationLink>
          ))}
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            isDisabled={page === qtdPages}
            onClick={() => onChange(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationShad>
  );
};

export default Pagination;
