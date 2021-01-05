module.exports = {
  idGenerator: function (prefix = '_',len = 9) {
    return prefix + Math.random().toString(36).substr(2, len);
  }
}