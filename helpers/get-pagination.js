const getPagination = ({
  link,
  page,
  pages,
  search,
  limit,
  orderBy,
  orderDir,
}) => {
  return {
    first:
      page > 1
        ? search
          ? `/${link}?search=${search}&page=1&limit=${limit}${
              orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
            }`
          : `/${link}?page=1&limit=${limit}${
              orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
            }`
        : null,
    prev:
      page > 1
        ? search
          ? `/${link}?search=${search}&page=${page - 1}&limit=${limit}${
              orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
            }`
          : `/${link}?page=${page - 1}&limit=${limit}${
              orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
            }`
        : null,
    next:
      page < pages
        ? search
          ? `/${link}?search=${search}&page=${page + 1}&limit=${limit}${
              orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
            }`
          : `/${link}?page=${page + 1}&limit=${limit}${
              orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
            }`
        : null,
    last:
      page < pages
        ? search
          ? `/${link}?search=${search}&page=${pages}&limit=${limit}${
              orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
            }`
          : `/${link}?page=${pages}&limit=${limit}${
              orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
            }`
        : null,
  };
};

module.exports = getPagination;
