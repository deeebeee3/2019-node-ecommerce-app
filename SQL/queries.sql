CREATE TABLE `node-complete`.`products`
(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR
(255) NOT NULL,
  `price` DOUBLE NOT NULL,
  `description` TEXT NOT NULL,
  `imageUrl` VARCHAR
(255) NOT NULL,
  PRIMARY KEY
(`id`),
  UNIQUE INDEX `id_UNIQUE`
(`id` ASC) VISIBLE);

INSERT INTO `
node-complete
`.`products`
(`title`, `price`, `description`, `imageUrl`) VALUES
('A book', '12.99', 'This is an awesome book', 'https://dictionary.cambridge.org/images/thumb/book_noun_001_01679.jpg?version=5.0.65');