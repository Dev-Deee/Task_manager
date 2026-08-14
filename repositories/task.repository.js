const Task = require('../models/task.model');

exports.create = (data) => Task.create(data);

exports.findAll = (where = {}) => Task.findAll({ where });

exports.findById = (id) => Task.findByPk(id);

exports.update = async (task, updates) => {
  return task.update(updates);
};

exports.remove = (task) => task.destroy();