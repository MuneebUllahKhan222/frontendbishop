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
END