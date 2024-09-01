# tạo database
CREATE DATABASE node44;
USE node44;

# tạo table
# tạo table users
# chuẩn đặt tên
# không được đặt trùng tên với keyword
# không có các ký tự đặc biệt: 
# space, %^&*
# tên table không được viết in hoa
# (BE kết nối tới SQL)
CREATE TABLE users(
	user_id INT,
	full_name VARCHAR(50),
	email VARCHAR(50),
	pass_word VARCHAR(255)
)


# 3 KIỂU DỮ LIỆU CHÍNH
# NUMBERIC: INT, FLOAT, ....
# STRING: VARCHAR, TEXT,...
# DATE: DATETIME, TIMESTAMP,..

# tạo data

INSERT INTO users (user_id, full_name, email, pass_word) VALUES
(1, 'John Doe', 'johndoe@example.com', 'password123'),
(2, 'Jane Smith', 'janesmith@example.com', 'password123'),
(3, 'Michael Johnson', 'michaelj@example.com', 'password123'),
(4, 'Emily Davis', 'emilyd@example.com', 'password123'),
(5, 'Chris Brown', 'chrisb@example.com', 'password123'),
(6, 'Sarah Wilson', 'sarahw@example.com', 'password123'),
(7, 'David Miller', 'davidm@example.com', 'password123'),
(8, 'Jessica Taylor', 'jessicat@example.com', 'password123'),
(9, 'Daniel Anderson', 'daniela@example.com', 'password123'),
(10, 'Laura Thomas', 'laurat@example.com', 'password123'),
(11, 'Paul Moore', 'paulm@example.com', 'password123'),
(12, 'Anna Jackson', 'annaj@example.com', 'password123'),
(13, 'Mark Lee', 'markl@example.com', 'password123'),
(14, 'Sophia Harris', 'sophiah@example.com', 'password123'),
(15, 'Peter Clark', 'peterc@example.com', 'password123'),
(16, 'Olivia Lewis', 'olivial@example.com', 'password123'),
(17, 'James Walker', 'jamesw@example.com', 'password123'),
(18, 'Linda Young', 'linday@example.com', 'password123'),
(19, 'Robert Hall', 'roberth@example.com', 'password123'),
(20, 'Susan Allen', 'susana@example.com', 'password123');

# tương tác với data
# Query (lấy dữ liệu)
# thêm, xóa, sửa
# Query:
INSERT INTO users (user_id, full_name, email, pass_word, age) VALUES
(1, 'John Doe', 'johndoe@example.com', 'password123', 28),
(2, 'Jane Smith', 'janesmith@example.com', 'password123', 34),
(3, 'Michael Johnson', 'michaelj@example.com', 'password123', 40),
(4, 'Emily Davis', 'emilyd@example.com', 'password123', 25),
(5, 'Chris Brown', 'chrisb@example.com', 'password123', 31),
(6, 'Sarah Wilson', 'sarahw@example.com', 'password123', 27),
(7, 'David Miller', 'davidm@example.com', 'password123', 45),
(8, 'Jessica Taylor', 'jessicat@example.com', 'password123', 22),
(9, 'Daniel Anderson', 'daniela@example.com', 'password123', 33),
(10, 'Laura Thomas', 'laurat@example.com', 'password123', 29),
(11, 'Paul Moore', 'paulm@example.com', 'password123', 36),
(12, 'Anna Jackson', 'annaj@example.com', 'password123', 24),
(13, 'Mark Lee', 'markl@example.com', 'password123', 38),
(14, 'Sophia Harris', 'sophiah@example.com', 'password123', 26),
(15, 'Peter Clark', 'peterc@example.com', 'password123', 32),
(16, 'Olivia Lewis', 'olivial@example.com', 'password123', 30),
(17, 'James Walker', 'jamesw@example.com', 'password123', 42),
(18, 'Linda Young', 'linday@example.com', 'password123', 37),
(19, 'Robert Hall', 'roberth@example.com', 'password123', 50),
(20, 'Susan Allen', 'susana@example.com', 'password123', 28);
SELECT * FROM users

SELECT full_name as 'Họ tên' from users

# tìm những người có tuổi từ 25-30
# C1:
SELECT * from users
WHERE age <= 30 and age >=25

#c2:
SELECT * from users
WHERE age BETWEEN 25 AND 30

# filter những người tên John
SELECT * FROM users
WHERE (full_name like '%John%') and (age BETWEEN 25 AND 30)

# sắp xếp tuổi theo thứ tự giảm dần
SELECT * FROM users
ORDER BY age DESC
LIMIT 5

# thêm column tuổi cho table users
ALTER TABLE users
ADD COLUMN age INT

# đổi kiểu dữ liệu cho column full_name
ALTER TABLE users
MODIFY COLUMN full_name VARCHAR(255)


# thêm constraint (ràng buộc) cho column
ALTER TABLE users
MODIFY COLUMN full_name VARCHAR(255) NOT NULL,
MODIFY COLUMN email VARCHAR(50) NOT NULL,
MODIFY COLUMN pass_word VARCHAR(255) NOT NULL

# thêm khóa chính (primary key) cho column user_id
ALTER TABLE users
MODIFY COLUMN user_id INT PRIMARY KEY AUTO_INCREMENT

# update data
UPDATE users
SET full_name = 'Duy Phương'
WHERE user_id = 1

select * from users
where user_id=1

# delete data
# hard delete - xóa hẳn data khỏi hệ thống
delete from users
where user_id=2

# soft delete -> thêm flag is_deleted để không show data
ALTER TABLE users
add COLUMN is_deleted INT NOT NULL DEFAULT 1

# 1 số câu query nâng cao
# tìm những người có tuổi lớn nhất
# B1: tìm tuổi lớn nhất
# b2: query những người có tuổi lớn nhất
select * from users
where age=(
	select age from users
	order by age desc
	limit 1
)

# Test push code leen git
# TEST GOP COMMIT
# TEST GOP COMMIT LAN 2
