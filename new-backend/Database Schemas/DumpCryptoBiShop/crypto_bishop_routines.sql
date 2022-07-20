-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: crypto_bishop
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping events for database 'crypto_bishop'
--

--
-- Dumping routines for database 'crypto_bishop'
--
/*!50003 DROP PROCEDURE IF EXISTS `bank_transfer_customer_to_iban` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `bank_transfer_customer_to_iban`(in user_id int unsigned, in IBAN int unsigned ,Amount int unsigned)
BEGIN
    DECLARE `_rollback` BOOL DEFAULT 0;
    DECLARE `rows_affected` INT DEFAULT 0; 
    DECLARE `sender_balance` INT DEFAULT 0;
    DECLARE `sender_iban` INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
    START TRANSACTION;
    
    -- Checking Whether User have enough amount in account
    SELECT  balance,IBAN_no into `sender_balance`,`sender_iban`  FROM bank_account WHERE customer_id = user_id;
    
    
	 UPDATE bank_account BA SET BA.balance = BA.balance - Amount WHERE BA.customer_id = user_id;
	SET `rows_affected` = `rows_affected` + row_count();
    
     UPDATE bank_account B SET B.balance = B.balance + Amount WHERE B.IBAN_no = IBAN ;
	SET `rows_affected` = `rows_affected` + row_count();

	INSERT INTO transfer_log(transferor_iban, transferee_iban, amount) VALUES (`sender_iban`, IBAN, Amount);


    IF `_rollback` OR (`rows_affected` < 2 ) OR (`sender_balance` < Amount) THEN
        ROLLBACK;
    ELSE
		SELECT "SUCCESS";
        COMMIT;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `buy_crypto_btc_userid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `buy_crypto_btc_userid`(in user_id INT UNSIGNED, in crypto_amount DECIMAL(10,5) UNSIGNED, in amount INT UNSIGNED)
BEGIN
   DECLARE `_rollback` BOOL DEFAULT 0;
    DECLARE `rows_affected` INT DEFAULT 0; 
    DECLARE `wallet_iban` INT DEFAULT 0;
	DECLARE `account_balance` INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
    
    START TRANSACTION;
    
    -- Checking Whether User have enough amount in account
    SELECT  balance, IBAN_no into `account_balance`,`wallet_iban`   FROM bank_account WHERE customer_id = user_id;

	UPDATE bank_account BA SET BA.balance = BA.balance - amount WHERE BA.customer_id = user_id;
	SET `rows_affected` = `rows_affected` + row_count();
    
	UPDATE crypto_wallet SET btc = btc + crypto_amount WHERE IBAN_no = `wallet_iban`;
	SET `rows_affected` = `rows_affected` + row_count();

	INSERT INTO buy_log(coin, coin_amount, amount_deduct, wallet_id) VALUES('BTC', crypto_amount, amount, (SELECT wallet_id FROM crypto_wallet WHERE IBAN_no = `wallet_iban`));
    
    SELECT `rows_affected`;
	IF `_rollback` OR (`rows_affected` < 2 ) THEN
        ROLLBACK;
	ELSE 
		COMMIT;
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `buy_crypto_currency_userid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `buy_crypto_currency_userid`(in user_id INT UNSIGNED, in crypto_amount DECIMAL(10,5) UNSIGNED, crypto_coin VARCHAR(3), in amount INT UNSIGNED)
BEGIN
   DECLARE `_rollback` BOOL DEFAULT 0;
    DECLARE `rows_affected` INT DEFAULT 0; 
    DECLARE `wallet_iban` INT DEFAULT 0;
	DECLARE `account_balance` INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
    START TRANSACTION;
    
    -- Checking Whether User have enough amount in account
    SELECT  balance, IBAN_no into `account_balance`,`wallet_iban`   FROM bank_account WHERE customer_id = user_id;
	SELECT crypto_coin FROM crypto_wallet WHERE iban_no = `wallet_iban`;
	-- UPDATE bank_account BA SET BA.balance = BA.balance - amount WHERE BA.customer_id = user_id;
	-- SET `rows_affected` = `rows_affected` + row_count();
    
   --  UPDATE crypto_wallet SET crypto_coin = crypto_coin + crypto_amount WHERE IBAN_no = `wallet_iban`;
	-- SET `rows_affected` = `rows_affected` + row_count();
	

    IF `_rollback` THEN
		ROLLBACK;
    ELSE
		SELECT "SUCCESS";
        COMMIT;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `buy_crypto_dgc_userid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `buy_crypto_dgc_userid`(in user_id INT UNSIGNED, in crypto_amount DECIMAL(10,5) UNSIGNED, in amount INT UNSIGNED)
BEGIN
   DECLARE `_rollback` BOOL DEFAULT 0;
    DECLARE `rows_affected` INT DEFAULT 0; 
    DECLARE `wallet_iban` INT DEFAULT 0;
	DECLARE `account_balance` INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
    
    START TRANSACTION;
    
    -- Checking Whether User have enough amount in account
    SELECT  balance, IBAN_no into `account_balance`,`wallet_iban`   FROM bank_account WHERE customer_id = user_id;

	UPDATE bank_account BA SET BA.balance = BA.balance - amount WHERE BA.customer_id = user_id;
	SET `rows_affected` = `rows_affected` + row_count();
    
	UPDATE crypto_wallet SET dgc = dgc + crypto_amount WHERE IBAN_no = `wallet_iban`;
	SET `rows_affected` = `rows_affected` + row_count();
	select `rows_affected`;
    
    INSERT INTO buy_log(coin, coin_amount, amount_deduct, wallet_id) VALUES('DGC', crypto_amount, amount, (SELECT wallet_id FROM crypto_wallet WHERE IBAN_no = `wallet_iban`));

	IF `_rollback` OR (`rows_affected` < 2 ) THEN
        ROLLBACK;
	ELSE 
		COMMIT;
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `buy_crypto_eth_userid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `buy_crypto_eth_userid`(in user_id INT UNSIGNED, in crypto_amount DECIMAL(10,5) UNSIGNED, in amount INT UNSIGNED)
BEGIN
   DECLARE `_rollback` BOOL DEFAULT 0;
    DECLARE `rows_affected` INT DEFAULT 0; 
    DECLARE `wallet_iban` INT DEFAULT 0;
	DECLARE `account_balance` INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
    
    START TRANSACTION;
    
    -- Checking Whether User have enough amount in account
    SELECT  balance, IBAN_no into `account_balance`,`wallet_iban`   FROM bank_account WHERE customer_id = user_id;

	UPDATE bank_account BA SET BA.balance = BA.balance - amount WHERE BA.customer_id = user_id;
	SET `rows_affected` = `rows_affected` + row_count();
    
	UPDATE crypto_wallet SET eth = eth + crypto_amount WHERE IBAN_no = `wallet_iban`;
	SET `rows_affected` = `rows_affected` + row_count();
	select `rows_affected`;
    INSERT INTO buy_log(coin, coin_amount, amount_deduct, wallet_id) VALUES('ETH', crypto_amount, amount, (SELECT wallet_id FROM crypto_wallet WHERE IBAN_no = `wallet_iban`));

	IF `_rollback` OR (`rows_affected` < 2 ) THEN
        ROLLBACK;
	ELSE 
		COMMIT;
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_transfer_log_by_user_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_transfer_log_by_user_id`(IN user_id INT)
BEGIN
		SELECT tl.transferor_iban, tl.transferee_iban, tl.amount as 'Transfered Amount', tl.date, c.username as 'Receiver Name', c.email as 'Receiver Email'  
		FROM transfer_log tl , bank_account ba, customer c
		WHERE 
			tl.transferee_iban = ba.IBAN_no 
			AND 
			c.customer_id = ba.customer_id
			AND
			(tl.transferor_iban = (SELECT IBAN_no FROM bank_account WHERE customer_id = user_id));
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sell_crypto_btc_userid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sell_crypto_btc_userid`(in user_id INT UNSIGNED, in crypto_amount DECIMAL(10,5) UNSIGNED, in amount INT UNSIGNED)
BEGIN
   DECLARE `_rollback` BOOL DEFAULT 0;
    DECLARE `rows_affected` INT DEFAULT 0; 
    DECLARE `wallet_iban` INT DEFAULT 0;
	DECLARE `account_balance` INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
    
    START TRANSACTION;
    
    -- Checking Whether User have enough amount in account
    SELECT  balance, IBAN_no into `account_balance`,`wallet_iban`   FROM bank_account WHERE customer_id = user_id;

	UPDATE bank_account BA SET BA.balance = BA.balance + amount WHERE BA.customer_id = user_id;
	SET `rows_affected` = `rows_affected` + row_count();
    
	UPDATE crypto_wallet SET btc = btc - crypto_amount WHERE IBAN_no = `wallet_iban`;
	SET `rows_affected` = `rows_affected` + row_count();
	select `rows_affected`;
    
    INSERT INTO sell_log(coin, coin_amount, amount_add, wallet_id) VALUES('BTC', crypto_amount, amount, (SELECT wallet_id FROM crypto_wallet WHERE IBAN_no = `wallet_iban`));

	IF `_rollback` OR (`rows_affected` < 2 ) THEN
        ROLLBACK;
	ELSE 
		COMMIT;
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sell_crypto_dgc_userid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sell_crypto_dgc_userid`(in user_id INT UNSIGNED, in crypto_amount DECIMAL(10,5) UNSIGNED, in amount INT UNSIGNED)
BEGIN
   DECLARE `_rollback` BOOL DEFAULT 0;
    DECLARE `rows_affected` INT DEFAULT 0; 
    DECLARE `wallet_iban` INT DEFAULT 0;
	DECLARE `account_balance` INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
    
    START TRANSACTION;
    
    -- Checking Whether User have enough amount in account
    SELECT  balance, IBAN_no into `account_balance`,`wallet_iban`   FROM bank_account WHERE customer_id = user_id;

	UPDATE bank_account BA SET BA.balance = BA.balance + amount WHERE BA.customer_id = user_id;
	SET `rows_affected` = `rows_affected` + row_count();
    
	UPDATE crypto_wallet SET dgc = dgc - crypto_amount WHERE IBAN_no = `wallet_iban`;
	SET `rows_affected` = `rows_affected` + row_count();
	select `rows_affected`;
    
    INSERT INTO sell_log(coin, coin_amount, amount_add, wallet_id) VALUES('DGC', crypto_amount, amount, (SELECT wallet_id FROM crypto_wallet WHERE IBAN_no = `wallet_iban`));

	IF `_rollback` OR (`rows_affected` < 2 ) THEN
        ROLLBACK;
	ELSE 
		COMMIT;
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sell_crypto_eth_userid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sell_crypto_eth_userid`(in user_id INT UNSIGNED, in crypto_amount DECIMAL(10,5) UNSIGNED, in amount INT UNSIGNED)
BEGIN
   DECLARE `_rollback` BOOL DEFAULT 0;
    DECLARE `rows_affected` INT DEFAULT 0; 
    DECLARE `wallet_iban` INT DEFAULT 0;
	DECLARE `account_balance` INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
    
    START TRANSACTION;
    
    -- Checking Whether User have enough amount in account
    SELECT  balance, IBAN_no into `account_balance`,`wallet_iban`   FROM bank_account WHERE customer_id = user_id;

	UPDATE bank_account BA SET BA.balance = BA.balance + amount WHERE BA.customer_id = user_id;
	SET `rows_affected` = `rows_affected` + row_count();
    
	UPDATE crypto_wallet SET eth = eth - crypto_amount WHERE IBAN_no = `wallet_iban`;
	SET `rows_affected` = `rows_affected` + row_count();
	select `rows_affected`;

	INSERT INTO sell_log(coin, coin_amount, amount_add, wallet_id) VALUES('ETH', crypto_amount, amount, (SELECT wallet_id FROM crypto_wallet WHERE IBAN_no = `wallet_iban`));

	IF `_rollback` OR (`rows_affected` < 2 ) THEN
        ROLLBACK;
	ELSE 
		COMMIT;
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `transfer_log_report` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `transfer_log_report`()
BEGIN
	SELECT tl.transferor_iban, sender.full_name as 'Sender Full Name', sender.email as 'Sender Email', sender.username as 'Sender UserName',  tl.transferee_iban, tl.amount as 'Transfered Amount', tl.date, c.full_name as 'Receiver Name', c.email as 'Receiver Email', c.username as 'Receiver User Name'  
	FROM transfer_log tl , bank_account ba, customer c, customer sender, bank_account sender_ba 
	WHERE 
		tl.transferor_iban = sender_ba.IBAN_no
        AND 
		sender.customer_id = sender_ba.customer_id
        AND
		tl.transferee_iban = ba.IBAN_no 
		AND 
		c.customer_id = ba.customer_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-07-17 22:34:04
