// Document model
module.exports = {
  tableName: 'docs',

  attributes: {
    title: {
      type: 'string'
    },
    slug: {
      type: 'string'
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
  }
};
