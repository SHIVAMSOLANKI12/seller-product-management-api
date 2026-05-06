/**
 * @desc    Get pagination metadata
 */
export const getPagination = (page, limit, total) => {
    const currentPage = parseInt(page, 10) || 1;
    const currentLimit = parseInt(limit, 10) || 10;
    const startIndex = (currentPage - 1) * currentLimit;
    const totalPages = Math.ceil(total / currentLimit);

    return {
        startIndex,
        limit: currentLimit,
        metadata: {
            totalRecords: total,
            currentPage,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
        },
    };
};
