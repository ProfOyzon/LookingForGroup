/**
 * Generates placeholders (?) for parameterized SQL queries
 * @param {any[]} arr - Array of values that placeholders are generated for
 * @returns - "?,?,?,?"
 */
const genPlaceholders = (arr) => {
  return arr.map(() => '?').join(',');
};

export { genPlaceholders };
