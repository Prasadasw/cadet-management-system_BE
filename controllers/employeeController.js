const { employee } = require('../models');

exports.registerEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, mobileNumber, designation } = req.body;

    // Check if employee with email already exists
    const existing = await employee.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const newEmployee = await employee.create({
      firstName,
      lastName,
      email,
      mobileNumber,
      designation,
    });

    res.status(201).json({ message: 'Employee registered successfully', data: newEmployee });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get All
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await employee.findAll();
    res.status(200).json(employees);
  } catch (err) {
    console.error('Get All Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) {
    console.error('Get by ID Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Update
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, mobileNumber, designation } = req.body;

    const employees = await employee.findByPk(id);
    if (!employees) return res.status(404).json({ message: 'Employee not found' });

    await employees.update({ firstName, lastName, email, mobileNumber, designation });

    res.status(200).json({ message: 'Employee updated successfully', data: employees });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete
exports.deleteEmployee = async (req, res) => {
  try {
    const employees = await employee.findByPk(req.params.id);
    if (!employees) return res.status(404).json({ message: 'Employee not found' });

    await employees.destroy();

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  
