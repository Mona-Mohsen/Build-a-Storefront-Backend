
**Database schema** 

**users** 

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
    
    userid uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    username VARCHAR (50) NOT NULL UNIQUE ,
    firstname VARCHAR (50) NOT NULL,
    lastname VARCHAR (50) NOT NULL,
    password VARCHAR (255) NOT NULL);

**products** 

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE products(

    productid uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    pname VARCHAR (64) NOT NULL UNIQUE,
    price int NOT NULL);
    
**Orders**

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE orders(

    orderid uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    ostatus VARCHAR(15) NOT NULL,
    userid uuid DEFAULT uuid_generate_v4 () NOT NULL,  FOREIGN KEY (userid) REFERENCES users (userid) );
**Order products** 

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE order_products(

    orderproductid uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    productid uuid DEFAULT uuid_generate_v4 (),
    orderid uuid DEFAULT uuid_generate_v4 (),
    quantity int NOT NULL ,
    FOREIGN KEY (productid) REFERENCES products (productid),
    FOREIGN KEY (orderid) REFERENCES orders (orderid) );

**API Endpoints**

**Users**

http://localhost:3000/users [GET] //[token required]

http://localhost:3000/users [POST] 

http://localhost:3000/users/:userid [DELETE] //[token required]

http://localhost:3000/users/:userid [PATCH] //[token required]

http://localhost:3000/users/ [PUT] // [token required]

http://localhost:3000/users/authenticate [POST]

**Products**

http://localhost:3000/products [GET] 

http://localhost:3000/products [POST] //[token required]

http://localhost:3000/products/:productid [DELETE] //[token required]

http://localhost:3000/products/:productid [PATCH] 

http://localhost:3000/products/ [PUT] //[token required]

**Orders**

http://localhost:3000/orders [GET]//[token required]

http://localhost:3000/orders [POST] //[token required]

http://localhost:3000/orders/:orderid [DELETE] //[token required]

http://localhost:3000/orders/:orderid [PATCH] //[token required]

http://localhost:3000/orders/ [PUT] //[token required]

 **Order Products**

http://localhost:3000/orderProducts [GET] //[token required]
http://localhost:3000/orderProducts [POST] //[token required]
http://localhost:3000/orderProducts/:orderproductid [DELETE] //[token required]
http://localhost:3000/orderProducts/:orderproductid [PATCH] //[token required]
http://localhost:3000/orderProducts/ [PUT] //[token required] 

**Home page**

http://localhost:3000/

**Page Not Found**

http://localhost:3000/anything

 