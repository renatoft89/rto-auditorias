const getAllUsersController = async (req, res) => {
  try {
    const mookedUsers = [
      { id: 1, name: 'John Doe', email: 'jonh@gmail.com'},
      { id: 2, name: 'Jane Doe', email: 'jane@gmail.com'},
    ];

    return res.status(200).json(mookedUsers);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getAllUsersController };
