import { validationResult } from 'express-validator';

const habits = [];
let nextId = 1;

export const getHabits = (req, res) => {
  res.json(habits);
};

export const createHabit = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const habit = {
    id: nextId++,
    ...req.body,
    createdAt: new Date(),
    completedDates: [],
  };

  habits.push(habit);
  res.status(201).json(habit);
};

export const updateHabit = (req, res) => {
  const { id } = req.params;
  const habitIndex = habits.findIndex(h => h.id === parseInt(id));

  if (habitIndex === -1) {
    return res.status(404).json({ error: 'Habit not found' });
  }

  habits[habitIndex] = {
    ...habits[habitIndex],
    ...req.body,
    id: parseInt(id),
  };

  res.json(habits[habitIndex]);
};

export const deleteHabit = (req, res) => {
  const { id } = req.params;
  const habitIndex = habits.findIndex(h => h.id === parseInt(id));

  if (habitIndex === -1) {
    return res.status(404).json({ error: 'Habit not found' });
  }

  habits.splice(habitIndex, 1);
  res.status(204).send();
};