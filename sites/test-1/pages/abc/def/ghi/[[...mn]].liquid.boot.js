const getServerProps = async ({ _ctx, params, query }) => {
  return {
    text: 'Hello from [[...mn]].liquid.boot.js ',
  }
}

module.exports = {
  getServerProps,
}