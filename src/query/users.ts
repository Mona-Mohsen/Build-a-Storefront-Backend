export const createusers = `INSERT INTO users (username, firstname, lastname, password)
VALUES ($1, $2, $3, $4) RETURNING userid, username, firstname, lastname`;

export const getusers = `SELECT  userid, username, firstname, lastname FROM users`;

export const getuserbyId = `SELECT  userid, username, firstname, lastname FROM users WHERE userid=$1`;

export  const updateuserbyId = `UPDATE users SET ( username, firstname, lastname, password) = ($1,$2,$3,$4) WHERE userid=$5  RETURNING userid, username, firstname, lastname`;

export const deleteuserbyId = `DELETE FROM users WHERE userid=$1 RETURNING userid, username, firstname, lastname`;

export const getpassbyusername = `SELECT password FROM users WHERE username=$1`;

export const  validuser =`SELECT userid, username, firstname, lastname FROM users where username=$1`;

export const deleteuser = `DELETE FROM users`;
