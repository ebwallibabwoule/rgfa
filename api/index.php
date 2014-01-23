<?php
include_once '../configuration.php';

session_start();
$loggedin = isset($_SESSION['ron_is_logged_in']);

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/blocks', 'getBlocks');
$app->get('/block/:id', 'getBlock');
$app->get('/blocks/search/:query', 'findByName');
$app->get('/blocks/search-extended/:query', 'findByDescription');

	$app->post('/block', 'addBlock');
	$app->put('/block/:id', 'updateBlock');
	$app->delete('/block/:id',	'deleteBlock');


$app->run();

function getBlocks() {
	$sql = "select * FROM block ORDER BY location";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$blocks = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"block": ' . json_encode($blocks) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getBlock($id) {
	$sql = "SELECT * FROM block WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$block = $stmt->fetchObject();  
		$db = null;
		echo json_encode($block); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function findByName($query) {
	$sql = "SELECT * FROM block WHERE UPPER(name) LIKE :query ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$blocks = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"block": ' . json_encode($blocks) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function findByDescription($query) {
	$sql = "SELECT * FROM block WHERE UPPER(description) LIKE :query OR UPPER(name) LIKE :query ORDER BY location";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$blocks = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"block": ' . json_encode($blocks) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getConnection() {
	$dbhost=HOST;
	$dbuser=USER;
	$dbpass=PASSWORD;
	$dbname=DATABASE;
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}	

function addBlock() {
	error_log('addBlock\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$block = json_decode($request->getBody());
	$sql = "INSERT INTO block (name, width, location, height, region, year, description) VALUES (:name, :width, :location, :height, :region, :year, :description)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $block->name);
		$stmt->bindParam("location", $block->location);
		$stmt->bindParam("width", $block->width);		
		$stmt->bindParam("height", $block->height);
		$stmt->bindParam("region", $block->region);
		$stmt->bindParam("year", $block->year);
		$stmt->bindParam("description", $block->description);
		$stmt->execute();
		$block->id = $db->lastInsertId();
		$db = null;
		echo json_encode($block); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateBlock($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$block = json_decode($body);
	$sql = "UPDATE block SET name=:name, location=:location, height=:height, width=:width, region=:region, year=:year, description=:description WHERE id=:id";
  try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $block->name);
		$stmt->bindParam("location", $block->location);
		$stmt->bindParam("height", $block->height);
		$stmt->bindParam("width", $block->width);
		$stmt->bindParam("region", $block->region);
		$stmt->bindParam("year", $block->year);
		$stmt->bindParam("description", $block->description);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($block); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteBlock($id) {
	$sql = "DELETE FROM block WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

?>
