toko_elektronik=# CREATE TABLE categories (
toko_elektronik(#     id SERIAL PRIMARY KEY,
toko_elektronik(#     name VARCHAR(100) NOT NULL
toko_elektronik(# );
CREATE TABLE


toko_elektronik=# INSERT INTO categories (name) VALUES
toko_elektronik-# ('Handphone'),
toko_elektronik-# ('Televisi'),
toko_elektronik-# ('Kulkas'),
toko_elektronik-# ('Mesin Cuci'),
toko_elektronik-# ('Aksesoris'),
toko_elektronik-# ('AC'),
toko_elektronik-# ('Monitor'),
toko_elektronik-# ('Smartwatch'),
toko_elektronik-# ('Laptop');
INSERT 0 9


toko_elektronik=# ALTER TABLE produk
toko_elektronik-# ADD COLUMN category_id INT;
ALTER TABLE
toko_elektronik=#
toko_elektronik=# ALTER TABLE produk
toko_elektronik-# ADD CONSTRAINT fk_category
toko_elektronik-# FOREIGN KEY (category_id) REFERENCES categories(id);
ALTER TABLE

toko_elektronik=# UPDATE produk
toko_elektronik-# SET category_id = categories.id
toko_elektronik-# FROM categories
toko_elektronik-# WHERE produk.category = categories.name;
UPDATE 9


------- HASIL NYAAAAAAAAA........ -------


toko_elektronik=# SELECT
toko_elektronik-#     produk.id,
toko_elektronik-#     produk.name AS nama_produk,
toko_elektronik-#     categories.name AS kategori,
toko_elektronik-#     produk.price
toko_elektronik-# FROM produk
toko_elektronik-# JOIN categories ON produk.category_id = categories.id;
 id |          nama_produk          |  kategori  |   price
----+-------------------------------+------------+------------
  1 | Smartphone Samsung A54        | Handphone  | 4299000.00
  3 | Smart TV LG 43 Inch           | Televisi   | 5999000.00
  4 | Kulkas Sharp 2 Pintu          | Kulkas     | 3299000.00
  5 | Mesin Cuci Samsung Front Load | Mesin Cuci | 4899000.00
  6 | Headset Sony WH-CH520         | Aksesoris  |  799000.00
  8 | Air Conditioner Daikin 1 PK   | AC         | 3999000.00
  9 | Monitor Samsung 24 Inch       | Monitor    | 1599000.00
 10 | Smartwatch Xiaomi Watch S1    | Smartwatch | 2499000.00
  2 | Laptop ASUS Vivobook 14       | Laptop     | 8000000.00
(9 rows)


toko_elektronik=# SELECT
toko_elektronik-#     categories.name AS kategori,
toko_elektronik-#     COUNT(produk.id) AS jumlah_barang
toko_elektronik-# FROM categories
toko_elektronik-# JOIN produk ON categories.id = produk.category_id
toko_elektronik-# GROUP BY categories.name;
  kategori  | jumlah_barang
------------+---------------
 Televisi   |             1
 Mesin Cuci |             1
 Monitor    |             1
 Aksesoris  |             1
 Laptop     |             1
 AC         |             1
 Smartwatch |             1
 Kulkas     |             1
 Handphone  |             1
(9 rows)



toko_elektronik=# SELECT
toko_elektronik-#     categories.name AS kategori,
toko_elektronik-#     produk.name AS nama_produk,
toko_elektronik-#     produk.price
toko_elektronik-# FROM produk
toko_elektronik-# JOIN categories ON produk.category_id = categories.id
toko_elektronik-# ORDER BY produk.price DESC
toko_elektronik-# LIMIT 1;
 kategori |       nama_produk       |   price
----------+-------------------------+------------
 Laptop   | Laptop ASUS Vivobook 14 | 8000000.00
(1 row)