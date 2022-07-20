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
END