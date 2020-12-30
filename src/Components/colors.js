export const colors = new Map([
  ["#000000", 1],
  ["#e91e63", 2],
  ["#9c27b0", 3],
  ["#2196f3", 4],
  ["#4caf50", 5],
  ["#ffeb3b", 6],
  ["#ff5722", 7],
  ["#795548", 8],
  ["#607d8b", 9]
])

export const colorsHexId = {}

colors.forEach((val, key) => {
  colorsHexId[val] = key
})