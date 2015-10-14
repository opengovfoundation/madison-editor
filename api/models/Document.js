// Document model
module.exports = {
  tableName: 'docs',

  attributes: {
    title: {
      type: 'string',
      required: true
    },
    slug: {
      type: 'string',
      required: true,
      alphanumericdashed: true
    },
    shortname: {
      type: 'string'
    },
    init_section: {
      type: 'integer'
    },
    created_at: {
      type: 'datetime',
      defaultsTo: function() {return new Date();}
    },
    updated_at: {
      type: 'datetime',
      defaultsTo: function() {return new Date();}
    },
    deleted_at: {
      type: 'datetime'
    }
  },

  // We override the default created/updated fields so we
  // can use our own names.
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //Resonsible for actually updating the 'updateDate' property.
  beforeUpdate:function(values,next) {
      values.updateDate= new Date();
      next();
  },

  findByUser: function(userId, page, limit) {

    var query = 'SELECT docs.* FROM ' + this.tableName +
      ' LEFT JOIN doc_user ON docs.id = doc_user.doc_id' +
      ' LEFT JOIN doc_group ON docs.id = doc_group.doc_id' +
      ' LEFT JOIN group_members ON group_members.group_id = doc_group.group_id' +
      ' WHERE (doc_user.user_id = ' + userId +
      ' OR group_members.user_id = ' + userId + ')' +
      ' ORDER BY docs.updated_at DESC';

    if(limit && page) {
      var offset = limit * (page - 1);
      query += ' LIMIT ' + offset + ', ' + limit;
    }

    var documentQuery = Promise.promisify(this.query);
    return documentQuery(query);
  },

  countByUser: function(userId)
  {
    var query = 'SELECT COUNT(*) AS count FROM ' + this.tableName +
      ' LEFT JOIN doc_user ON docs.id = doc_user.doc_id' +
      ' LEFT JOIN doc_group ON docs.id = doc_group.doc_id' +
      ' LEFT JOIN group_members ON group_members.group_id = doc_group.group_id' +
      ' WHERE (doc_user.user_id = ' + userId +
      ' OR group_members.user_id = ' + userId + ')';

    var countQuery = Promise.promisify(this.query);

    return countQuery(query);
  },

  getByUser: function(docId, userId) {
    var query = 'SELECT *, docs.id as id FROM ' + this.tableName +
      ' LEFT JOIN doc_user ON docs.id = doc_user.doc_id' +
      ' LEFT JOIN doc_group ON docs.id = doc_group.doc_id' +
      ' LEFT JOIN group_members ON group_members.group_id = doc_group.group_id' +
      ' WHERE docs.id = ' + docId + ' AND' +
      ' (doc_user.user_id = ' + userId +
      ' OR group_members.user_id = ' + userId + ')' +
      ' ORDER BY docs.updated_at DESC';

    var documentQuery = Promise.promisify(this.query);
    return documentQuery(query);
  }
};
