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
END