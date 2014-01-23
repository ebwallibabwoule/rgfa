<?php
include_once 'configuration.php';



if (isset($_POST['user']) && isset($_POST['ww'])) {
	if ($_POST['user'] === 'ron' && $_POST['ww'] === 'powerpop') {
		$_SESSION['ron_is_logged_in'] = true;
		echo 'Je bent ingelogd. ' . $_SESSION['ron_is_logged_in'] ;
		


		
		exit;
	} 
	else {
		if (isset($_SESSION['ron_is_logged_in'])) {
		   unset($_SESSION['ron_is_logged_in']);
		}
	
		echo 'De gebruikersnaam of het wachtwoord is niet juist. ' . $_SESSION['ron_is_logged_in'] ;
	}
}


	
?>

<form method="post" name="frm" id="frm" action="login.php">
  <div class="regbox">
	<div class="loginlabel left">Gebruiker</div>
	<input name="user" type="text" class="input left" id="user">
	<div class="clear"></div>
  </div>
  <div class="regbox">
	<div class="loginlabel left">Wachtwoord</div>
	<input name="ww" type="password" class="input left" id="ww">
	<div class="clear"></div>
	<input type="submit" name="log" value="Login" class="submitbutton">
  </div>
</form>