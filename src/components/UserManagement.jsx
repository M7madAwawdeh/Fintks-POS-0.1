import React, { useState, useEffect } from 'react';
    import { useAuth } from '../contexts/AuthContext';
    import { createUser, getUsers, updateUser, deleteUser } from '../services/userService';
    import { useTranslation } from '../hooks/useTranslation';

    function UserManagement() {
      const [users, setUsers] = useState([]);
      const [newUser, setNewUser] = useState({ username: '', role: 'cashier', password: '' });
      const [selectedUser, setSelectedUser] = useState(null);
      const [editMode, setEditMode] = useState(false);
      const [searchQuery, setSearchQuery] = useState('');
      const { currentUser } = useAuth();
      const { t } = useTranslation();

      useEffect(() => {
        fetchUsers();
      }, []);

      const fetchUsers = async () => {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      };

      const handleInputChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
      };

      const handleCreateUser = async () => {
        await createUser(newUser);
        fetchUsers();
        setNewUser({ username: '', role: 'cashier', password: '' });
      };

      const handleEditUser = (user) => {
        setSelectedUser(user);
        setNewUser({ username: user.username, role: user.role, password: '' });
        setEditMode(true);
      };

      const handleUpdateUser = async () => {
        if (selectedUser) {
          await updateUser(selectedUser.id, { ...newUser, id: selectedUser.id });
          fetchUsers();
          setNewUser({ username: '', role: 'cashier', password: '' });
          setSelectedUser(null);
          setEditMode(false);
        }
      };

      const handleDeleteUser = async (id) => {
        await deleteUser(id);
        fetchUsers();
      };

      const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
      };

      const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return (
        <div>
          <h2>{t('userManagement')}</h2>
          {currentUser && currentUser.role === 'admin' && (
            <div>
              <h3>{t('addNewUser')}</h3>
              <div className="form-group">
                <label>{t('username')}</label>
                <input
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>{t('role')}</label>
                <select name="role" value={newUser.role} onChange={handleInputChange}>
                  <option value="admin">{t('admin')}</option>
                  <option value="cashier">{t('cashier')}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t('password')}</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                />
              </div>
              {!editMode ? (
                <button onClick={handleCreateUser}>{t('createUser')}</button>
              ) : (
                <button onClick={handleUpdateUser}>{t('updateUser')}</button>
              )}
            </div>
          )}
          <div className="form-group">
            <label>{t('searchUsers')}</label>
            <input
              type="text"
              placeholder={t('searchByUsernameOrRole')}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <h3>{t('userList')}</h3>
          <table>
            <thead>
              <tr>
                <th>{t('username')}</th>
                <th>{t('role')}</th>
                {currentUser && currentUser.role === 'admin' && <th>{t('actions')}</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  {currentUser && currentUser.role === 'admin' && (
                    <td>
                      <button onClick={() => handleEditUser(user)}>{t('edit')}</button>
                      <button onClick={() => handleDeleteUser(user.id)}>{t('delete')}</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    export default UserManagement;
