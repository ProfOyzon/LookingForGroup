//generate placeholders for SQL
const genPlaceholders = (arr) => {
  return arr.map(() => '?').join(',');
};

export { genPlaceholders };
