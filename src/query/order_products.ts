export const createorderproduct = `INSERT INTO order_products (productid ,orderid,quantity)
VALUES ($1,$2,$3) RETURNING * `;

export const getorderproducts = `SELECT * FROM order_products`;

export const getorderproductbyId = `SELECT * FROM order_products WHERE  orderproductid=$1`;

export const updateorderproductbyId = `UPDATE order_products SET ( productid, orderid, quantity) = 
($1,$2,$3) WHERE orderproductid=$4  RETURNING *`;

export const deleteorderproductbyId = `DELETE FROM order_products WHERE orderproductid=$1 RETURNING *`;

export const deleteorderproducts = `DELETE FROM order_products`;
