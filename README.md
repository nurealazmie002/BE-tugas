postgres=# CREATE TABLE produk (
postgres(# id SERIAL PRIMARY KEY,
postgres(# name VARCHAR(100) NOT NULL,
postgres(# category VARCHAR(100) NOT NULL,
postgres(# price DECIMAL(10,2) NOT NULL,
postgres(# stock INT DEFAULT 0,
postgres(# is_active BOOLEAN DEFAULT TRUE,
postgres(#
postgres(# created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
postgres(# );
CREATE TABLE

    
postgres=# SELECT * FROM produk;
 id | name | category | price | stock | is_active | created_at
----+------+----------+-------+-------+-----------+------------
(0 rows)

postgres=# INSERT INTO produk (name, category, price, stock, is_active)
postgres-# VALUES
postgres-# ('Smartphone Samsung A54', 'Handphone', 4299000, 15, TRUE),
postgres-#
postgres-# ('Laptop ASUS Vivobook 14', 'Laptop', 7999000, 10, TRUE),
postgres-#
postgres-# ('Smart TV LG 43 Inch', 'Televisi', 5999000, 7, TRUE),
postgres-#
postgres-# ('Kulkas Sharp 2 Pintu', 'Kulkas', 3299000, 12, TRUE),
postgres-#
postgres-# ('Mesin Cuci Samsung Front Load', 'Mesin Cuci', 4899000, 8, TRUE),
postgres-#
postgres-# ('Headset Sony WH-CH520', 'Aksesoris', 799000, 25, TRUE),
postgres-#
postgres-# ('Bluetooth Speaker JBL Go 3', 'Speaker', 529000, 30, TRUE),
postgres-#
postgres-# ('Air Conditioner Daikin 1 PK', 'AC', 3999000, 5, TRUE),
postgres-#
postgres-# ('Monitor Samsung 24 Inch', 'Monitor', 1599000, 20, TRUE),
postgres-#
postgres-# ('Smartwatch Xiaomi Watch S1', 'Smartwatch', 2499000, 18, TRUE);
INSERT 0 10


postgres=# SELECT * FROM produk;
 id |             name              |  category  |   price    | stock | is_active |        created_at
----+-------------------------------+------------+------------+-------+-----------+--------------------------
  1 | Smartphone Samsung A54        | Handphone  | 4299000.00 |    15 | t         | 2025-12-08 13:42:08.8224
  2 | Laptop ASUS Vivobook 14       | Laptop     | 7999000.00 |    10 | t         | 2025-12-08 13:42:08.8224
  3 | Smart TV LG 43 Inch           | Televisi   | 5999000.00 |     7 | t         | 2025-12-08 13:42:08.8224
  4 | Kulkas Sharp 2 Pintu          | Kulkas     | 3299000.00 |    12 | t         | 2025-12-08 13:42:08.8224
  5 | Mesin Cuci Samsung Front Load | Mesin Cuci | 4899000.00 |     8 | t         | 2025-12-08 13:42:08.8224
  6 | Headset Sony WH-CH520         | Aksesoris  |  799000.00 |    25 | t         | 2025-12-08 13:42:08.8224
  7 | Bluetooth Speaker JBL Go 3    | Speaker    |  529000.00 |    30 | t         | 2025-12-08 13:42:08.8224
  8 | Air Conditioner Daikin 1 PK   | AC         | 3999000.00 |     5 | t         | 2025-12-08 13:42:08.8224
  9 | Monitor Samsung 24 Inch       | Monitor    | 1599000.00 |    20 | t         | 2025-12-08 13:42:08.8224
 10 | Smartwatch Xiaomi Watch S1    | Smartwatch | 2499000.00 |    18 | t         | 2025-12-08 13:42:08.8224
(10 rows)


postgres=# SELECT *
postgres-# FROM produk
postgres-# WHERE price > 5000000;
 id |          name           | category |   price    | stock | is_active |        created_at
----+-------------------------+----------+------------+-------+-----------+--------------------------
  2 | Laptop ASUS Vivobook 14 | Laptop   | 7999000.00 |    10 | t         | 2025-12-08 13:42:08.8224
  3 | Smart TV LG 43 Inch     | Televisi | 5999000.00 |     7 | t         | 2025-12-08 13:42:08.8224
(2 rows)


postgres=# SELECT *
postgres-# FROM produk
postgres-# WHERE category = 'Laptop';
 id |          name           | category |   price    | stock | is_active |        created_at
----+-------------------------+----------+------------+-------+-----------+--------------------------
  2 | Laptop ASUS Vivobook 14 | Laptop   | 7999000.00 |    10 | t         | 2025-12-08 13:42:08.8224
(1 row)


postgres=# SELECT *
postgres-# FROM produk
postgres-# WHERE category = 'Laptop';
 id |          name           | category |   price    | stock | is_active |        created_at
----+-------------------------+----------+------------+-------+-----------+--------------------------
  2 | Laptop ASUS Vivobook 14 | Laptop   | 7999000.00 |    10 | t         | 2025-12-08 13:42:08.8224
(1 row)


postgres=# UPDATE produk
postgres-# SET price = 8000000, stock = 11
postgres-# WHERE id = 2 ;
UPDATE 1
postgres=# SELECT *
postgres-# FROM produk WHERE name LIKE '%Laptop%';
 id |          name           | category |   price    | stock | is_active |        created_at
----+-------------------------+----------+------------+-------+-----------+--------------------------
  2 | Laptop ASUS Vivobook 14 | Laptop   | 8000000.00 |    11 | t         | 2025-12-08 13:42:08.8224
(1 row)


postgres=# DELETE FROM produk WHERE id = ( SELECT id FROM produk ORDER BY price ASC LIMIT 1 );
DELETE 1
postgres=# SELECT * FROM produk;
 id |             name              |  category  |   price    | stock | is_active |        created_at
----+-------------------------------+------------+------------+-------+-----------+--------------------------
  1 | Smartphone Samsung A54        | Handphone  | 4299000.00 |    15 | t         | 2025-12-08 13:42:08.8224
  3 | Smart TV LG 43 Inch           | Televisi   | 5999000.00 |     7 | t         | 2025-12-08 13:42:08.8224
  4 | Kulkas Sharp 2 Pintu          | Kulkas     | 3299000.00 |    12 | t         | 2025-12-08 13:42:08.8224
  5 | Mesin Cuci Samsung Front Load | Mesin Cuci | 4899000.00 |     8 | t         | 2025-12-08 13:42:08.8224
  6 | Headset Sony WH-CH520         | Aksesoris  |  799000.00 |    25 | t         | 2025-12-08 13:42:08.8224
  8 | Air Conditioner Daikin 1 PK   | AC         | 3999000.00 |     5 | t         | 2025-12-08 13:42:08.8224
  9 | Monitor Samsung 24 Inch       | Monitor    | 1599000.00 |    20 | t         | 2025-12-08 13:42:08.8224
 10 | Smartwatch Xiaomi Watch S1    | Smartwatch | 2499000.00 |    18 | t         | 2025-12-08 13:42:08.8224
  2 | Laptop ASUS Vivobook 14       | Laptop     | 8000000.00 |    11 | t         | 2025-12-08 13:42:08.8224
(9 rows)


Apa kepanjangan dari SQL? b. Structured Query Language 

Manakah yang termasuk database Relasional (SQL)? c. PostgreSQL 

Perintah untuk mengambil data dari tabel adalah... c. SELECT 

Tipe data yang paling tepat untuk menyimpan harga barang agar presisi adalah... c. DECIMAL 

Apa fungsi PRIMARY KEY pada sebuah tabel? b. Sebagai pengenal unik setiap baris data 

Query untuk menampilkan data produk yang stoknya habis (0) adalah... a. SELECT * FROM products WHERE stock = 0; 

Perintah ORDER BY price DESC artinya...  b. Urutkan harga dari termahal ke termurah 

Apa yang terjadi jika kita menjalankan DELETE FROM products; tanpa WHERE?  c. Semua data di tabel products akan terhapus 

Untuk mengubah data yang sudah ada, kita menggunakan perintah...  c.UPDATE 

Tipe data VARCHAR(50) artinya...  b. Teks maksimal 50 karakter 