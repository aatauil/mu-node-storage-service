/**
 * Takes in the response from the database and parses it to a flat(ter) user friendly object
 * @param {object} result 
 * @returns object 
 */

const parseResults = function(result) {
  const bindingKeys = result.head.vars;
  const obj = {};
  result.results.bindings.map((row) => {
    bindingKeys.forEach((key) => obj[key] = row[key].value);
  });

  return obj;
};

export default parseResults;
