// Document-User join model
module.exports = {
  tableName: 'doc_user',

  attributes: {
    user_id: {
      type: 'integer'
    },
    doc_id: {
      type: 'integer'
    }
    // user: {
    //   columnName: 'user_id',
    //   type: 'integer',
    //   foreignKey: true,
    //   references: 'users',
    //   on: 'id',
    //   via: 'docs',
    //   groupBy: 'users'
    // },
    // doc: {
    //   columnName: 'doc_id',
    //   type: 'integer',
    //   foreignKey: true,
    //   references: 'docs',
    //   on: 'id',
    //   via: 'users',
    //   groupBy: 'docs'
    // }
  },

  autoCreatedAt: false,
  autoUpdatedAt: false
};
