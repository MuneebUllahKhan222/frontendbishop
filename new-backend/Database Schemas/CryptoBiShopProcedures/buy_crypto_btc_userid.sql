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
END