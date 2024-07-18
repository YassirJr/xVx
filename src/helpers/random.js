/**
 * Returns a random value of the specified type and length.
 * @param {string} type - The type of value to generate (number or boolean).
 * @param {number} length - The length of the value to generate (for numbers only).
 * @returns {number|boolean|string} - A random value of the specified type and length.
 */
export const getRandom = (type, length) => {
  switch (type) {
    case 'number':
      return getRandomNum(length)
    case 'boolean':
      return Math.round(Math.random())
    default:
      return 'value'
  }
}

/**
 * Returns a random number with the specified number of digits.
 * @param {number} length - The number of digits in the random number.
 * @returns {number} - A random number with the specified number of digits.
 */
export const getRandomNum = (length = 1) => {
  const max = Math.pow(10, length) - Math.pow(10, length - 1)
  const randomNumber = Math.floor(Math.random() * max + Math.pow(10, length - 1))

  return randomNumber
}
