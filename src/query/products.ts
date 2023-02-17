export const createproduct = `INSERT INTO products (pname, price)
VALUES ($1, $2) RETURNING *`;
export const getproducts = `SELECT * FROM products`;
export const getproductbyId = `SELECT  productid, pname, price FROM products WHERE productid=$1 `;
export const updateproductbyId = `UPDATE products SET pname=$1, price=$2 WHERE productid=$3 RETURNING *`;
export const deleteproductbyId = `DELETE FROM products WHERE productid=($1) RETURNING productid, pname, price`;
export const deleteproducts = `DELETE FROM products`;
