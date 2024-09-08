create database node44
USE node44
# Tạo table video
create table video(
	video_id INT PRIMARY KEY AUTO_INCREMENT,
	video_name VARCHAR(255),
	description VARCHAR(255)
)

create(video{

})

INSERT INTO video (video_name, description) VALUES
('Video 1', 'This is a description for Video 1'),
('Video 2', 'This is a description for Video 2'),
('Video 3', 'This is a description for Video 3'),
('Video 4', 'This is a description for Video 4'),
('Video 5', 'This is a description for Video 5'),
('Video 6', 'This is a description for Video 6'),
('Video 7', 'This is a description for Video 7'),
('Video 8', 'This is a description for Video 8'),
('Video 9', 'This is a description for Video 9'),
('Video 10', 'This is a description for Video 10'),
('Video 11', 'This is a description for Video 11'),
('Video 12', 'This is a description for Video 12'),
('Video 13', 'This is a description for Video 13'),
('Video 14', 'This is a description for Video 14'),
('Video 15', 'This is a description for Video 15'),
('Video 16', 'This is a description for Video 16'),
('Video 17', 'This is a description for Video 17'),
('Video 18', 'This is a description for Video 18'),
('Video 19', 'This is a description for Video 19'),
('Video 20', 'This is a description for Video 20');

# tạo data

# tạo user
CREATE USER 'nha.nguyen'@'%' IDENTIFIED BY 'password';

# CẤP QUYỀN CHỈ ĐƯỢC SELECT DATA CHO DATABASE node44
GRANT ALL PRIVILEGES ON node44.* TO 'nha.nguyen'@'%';
# COMMIT
flush PRIVILEGES;

GRANT INSERT ON node44.* TO 'thai'@'%';
flush PRIVILEGES;

# remove quyền insert cho Thái
REVOKE INSERT ON node44.* from 'thai'@'%';
flush PRIVILEGES;

# kiểm tra user đó có những quyền nào
SHOW GRANTS FOR 'thai'@'%';

# xóa user
DROP USER 'thai'@'%';
flush PRIVILEGES;

# KILL session cho user đó
# show những session
SHOW PROCESSLIST
KILL 51


video
users
comments, giả sử ko thêm on delete cascade
likes, giả sử ko thêm on delete cascade

=> trước khi có procedure
remove comment của user A
remove like của user A
delete user A (soft delete)

=> chỉ cần define procedure chứa logic remove users
=> chỉ cần 1 dòng code
DELIMITER //





CREATE PROCEDURE select_video(IN A INT)
BEGIN
	update video
	set video_name = A;
END //
DELIMITER

call select_video()

sql = "call select_video()"
cursor.excute(sql)
cursor.commit()

------- procedure

# table users
create table users(
	user_id INT PRIMARY KEY AUTO_INCREMENT,
	full_name varchar(50),
	email varchar(255),
	age int,
	gender INT
)

drop table users


INSERT INTO users (full_name, email, age, gender) VALUES
('Raven Matthews', 'sarahprince@meyer.net', 49, 1),
('William Pennington', 'john08@reeves-morrison.com', 22, 0),
('Laura Mooney', 'craigeverett@gmail.com', 48, 0),
('Katherine Smith', 'ccollins@gmail.com', 46, 0),
('Marcus Davis', 'andrew86@jackson.com', 21, 0),
('Danielle Phillips', 'brian51@green.com', 53, 0),
('Crystal Maldonado', 'melanie77@yahoo.com', 35, 1),
('Kristin Wilson', 'jsmith@lee.com', 26, 0),
('Angela Brown', 'sbryant@hotmail.com', 44, 0),
('Sean Fisher', 'christina66@yahoo.com', 38, 0),
('Tracy Rivera', 'joneswendy@johnson.com', 56, 1),
('Deborah Thompson', 'andreasmall@yahoo.com', 50, 1),
('Shannon Williams', 'wparker@yahoo.com', 32, 1),
('Justin Mcclain', 'heidiwashington@perez.com', 60, 1),
('Erika Jimenez', 'sanchezrachel@hotmail.com', 27, 0),
('Denise Pierce', 'kmcconnell@gmail.com', 45, 1),
('Veronica Simmons', 'murphychristina@vaughn.com', 53, 1),
('Shawn Tyler', 'christine91@west.com', 34, 1),
('Ryan Martinez', 'davidyoung@robinson.com', 23, 0),
('Jessica Nelson', 'kelly26@yahoo.com', 31, 1);

select * from users


CREATE TABLE videos (
    video_id INT PRIMARY KEY AUTO_INCREMENT,
    video_name VARCHAR(50),
    descriptions VARCHAR(255)
);

-- Insert 20 sample rows into the table
INSERT INTO videos (video_name, descriptions) VALUES
('Introduction to C#', 'A beginner-level introduction to C# programming'),
('What is the params keyword?', 'Explanation and use cases of the params keyword in C#'),
('Understanding Arrays in C#', 'An in-depth look at arrays and how to use them in C#'),
('Classes and Objects', 'Exploring object-oriented programming in C# with practical examples'),
('Methods in C#', 'Introduction to methods, parameters, and return types in C#'),
('Inheritance in C#', 'Understanding inheritance and its use in OOP in C#'),
('Polymorphism in C#', 'Learn how polymorphism works in C# with practical examples'),
('Exception Handling in C#', 'How to handle errors using try, catch, and finally blocks'),
('File Handling in C#', 'Working with files in C# for reading and writing data'),
('Asynchronous Programming in C#', 'An introduction to async and await for asynchronous code'),
('Introduction to LINQ', 'Exploring LINQ and its powerful features for querying collections'),
('Delegates and Events', 'Understanding how to work with delegates and events in C#'),
('Lambda Expressions', 'Introduction to lambda expressions and their usage in C#'),
('What if: Variables Change Types?', 'A fun exploration of dynamic variables and type changes in C#'),
('Switch Case Feature in C#', 'Understanding the switch statement in C# and its practical uses'),
('Working with Databases in C#', 'How to connect and interact with databases using C#'),
('Entity Framework Basics', 'Learn how to use Entity Framework for database management in C#'),
('Debugging C# Code', 'Tips and techniques for debugging your C# code effectively'),
('Creating a Simple Web API', 'How to build a simple Web API using C# and ASP.NET Core'),
('Game Development in C#', 'Introduction to basic game development concepts in C#')
;

SELECT * FROM videos

# tạo table trung gian user_like
create table user_like(
	id INT PRIMARY KEY AUTO_INCREMENT,
	
	user_id INT,
	FOREIGN KEY(user_id) REFERENCES users(user_id),
	
	video_id INT,
	FOREIGN KEY(video_id) REFERENCES videos(video_id)
)

drop table user_like

select * from users

# lưu ý: user_id và video_id phải có trong table users và videos
INSERT INTO user_like (user_id, video_id) VALUES
(1, 1),
(3, 3),
(1, 4),
(3, 6),
(1, 7),
(3, 9),
(1, 10),
(3, 12),
(1, 13),
(3, 15),
(1, 16),
(3, 18),
(1, 19);

# CREATE PROCEDURE
DELIMITER //
CREATE PROCEDURE select_users()
BEGIN
	select * from node44.users;
END //
DELIMITER

call select_users()


DELIMITER //
CREATE PROCEDURE remove_user(IN id INT, OUT message varchar(255))
BEGIN
	IF id <> 1 then
		delete from user_like where user_id = id;
		delete from users where user_id = id;
		set message = 'user khac id 1 da xoa';
	ELSE
		SET message = 'user id 1 da xoa';
	END IF;
END //
DELIMITER


drop PROCEDURE remove_user;

call remove_user(2, @message);
select @message;



select * from user_like;
select * from users