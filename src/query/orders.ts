export const createorder = `INSERT INTO orders (ostatus,userid)
VALUES ($1,$2) RETURNING orderid, ostatus, userid`;
export const getorders = `SELECT * FROM orders`;
export const getorderbyId = `SELECT userid, ostatus , orderid FROM orders WHERE orderid=($1)`;
export const updateorderbyId = `UPDATE orders SET ( ostatus, userid) = ($1,$2) WHERE orderid=$3  RETURNING *`;
export const deleteorderbyId =  `DELETE FROM orders WHERE orderid=$1 RETURNING *`;
export const deleteorders = `DELETE FROM orders`;
