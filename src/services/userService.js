import localforage from 'localforage';
    import { v4 as uuidv4 } from 'uuid';

    const USER_KEY = 'users';

    export const createUser = async (user) => {
      const users = (await localforage.getItem(USER_KEY)) || [];
      const newUser = { ...user, id: uuidv4() };
      users.push(newUser);
      await localforage.setItem(USER_KEY, users);
      return newUser;
    };

    export const getUsers = async () => {
      let users = (await localforage.getItem(USER_KEY)) || [];
      if (users.length === 0) {
        const defaultUser = {
          id: uuidv4(),
          username: 'fintks',
          password: 'fintks',
          role: 'admin',
        };
        users = [defaultUser];
        await localforage.setItem(USER_KEY, users);
      }
      return users;
    };

    export const updateUser = async (id, updatedUser) => {
      const users = (await localforage.getItem(USER_KEY)) || [];
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, ...updatedUser } : user
      );
      await localforage.setItem(USER_KEY, updatedUsers);
      return updatedUser;
    };

    export const deleteUser = async (id) => {
      const users = (await localforage.getItem(USER_KEY)) || [];
      const filteredUsers = users.filter((user) => user.id !== id);
      await localforage.setItem(USER_KEY, filteredUsers);
    };
