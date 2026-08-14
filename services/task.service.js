const taskRepository = require('../repositories/task.repository');
const AppError = require('../utils/AppError');
const isValidUUID = require('../utils/isValidUUID');

const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

exports.createTask = async ({ title, description, status, dueDate }) => {
  if (!title || title.trim() === '') {
    throw new AppError('Title is required', 400);
  }
  return taskRepository.create({ title, description, status, dueDate });
};

exports.getAllTasks = async (statusFilter) => {
  const where = {};
  if (statusFilter) {
    if (!VALID_STATUSES.includes(statusFilter)) {
      throw new AppError(`Invalid status filter: ${statusFilter}`, 400);
    }
    where.status = statusFilter;
  }
  return taskRepository.findAll(where);
};

exports.getTaskById = async (id) => {
  if (!isValidUUID(id)) {
    throw new AppError('Invalid task ID format', 400);
  }
  const task = await taskRepository.findById(id);
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  return task;
};


exports.updateTask = async (id, body) => {
  if (!isValidUUID(id)) {
    throw new AppError('Invalid task ID format', 400);
  }
  const task = await taskRepository.findById(id);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const allowedFields = ['title', 'description', 'status', 'dueDate'];
  const updates = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  if (updates.status && !VALID_STATUSES.includes(updates.status)) {
    throw new AppError(`Invalid status: ${updates.status}`, 400);
  }

  return taskRepository.update(task, updates);
};

exports.deleteTask = async (id) => {
  if (!isValidUUID(id)) {
    throw new AppError('Invalid task ID format', 400);
  }
  const task = await taskRepository.findById(id);
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  await taskRepository.remove(task);
};