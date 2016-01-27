// Document Types model
module.exports = {
  tableName: 'doc_types',

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    style: {
      type: 'string'
    },
    context: {
      type: 'string'
    }
  },

  autoCreatedAt: false,
  autoUpdatedAt: false
};
