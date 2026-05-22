import PageButton from "./PageButton";

interface PaginationProps {
    page: number;
    totalPages: number;
    span: number;
    onPageChange: (page: number) => void
};

function Pagination({page, totalPages, span, onPageChange} : PaginationProps){
    const maxButtons = span * 2 + 1; // Total number of page buttons to show
    let startPage = page - span;
    let endPage = page + span;
    let pageButtons = [];

    if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(maxButtons, totalPages);
    }
    
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, totalPages - maxButtons + 1);
    }
    
    if (page > 1){
        pageButtons.push(
            <PageButton 
                key="prev"
                text={"<"}
                onClick={() => onPageChange(page - 1)}
            />
        )
    }

    for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
            <PageButton 
                key={i}
                text={i.toString()}
                selected={i === page}
                onClick={() => onPageChange(i)}
            />
        )
    }

    if (page < totalPages) {
        pageButtons.push(
            <PageButton 
                key="next"
                text={">"}
                onClick={() => onPageChange(page + 1)}
            />
        )
    }

    return (
        <div className="flex flex-row gap-2">
            {pageButtons}
        </div>
    )
}

export default Pagination