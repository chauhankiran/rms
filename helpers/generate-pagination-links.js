const generatePaginationLinks = ({
    link,
    page,
    pages,
    search,
    limit,
    orderBy,
    orderDir,
}) => {
    // Helper function to build query string
    const generateUrl = (pageNum) => {
        const searchQuery = search ? `search=${search}&` : "";
        const orderQuery = orderBy
            ? `&orderBy=${orderBy}&orderDir=${orderDir}`
            : "";
        return `${link}?${searchQuery}page=${pageNum}&limit=${limit}${orderQuery}`;
    };

    return {
        first: page > 1 && generateUrl(1),
        prev: page > 1 && generateUrl(page - 1),
        next: page < pages && generateUrl(page + 1),
        last: page < pages && generateUrl(pages),
    };
};

module.exports = generatePaginationLinks;
