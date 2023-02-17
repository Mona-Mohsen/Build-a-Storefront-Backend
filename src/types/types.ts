export type users = {
    userid: string;
    username: string;
    firstname: string;
    lastname: string;
    password: string;
  };
 export type products = {
    productid: string;
    pname: string;
    price: number;
  };
  export type orders = {
    orderid: string;
    ostatus: string;
    userid: string;
  };
  export type order_products = {
    orderproductid: string;
    productid: string;
    orderid: string;
    quantity: number;
  };
  
  
 
  
  

  