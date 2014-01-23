// The root URL for the RESTful services
var rootURL = "api/blocks";

var currentBlock;

// Retrieve block list when application starts 
findAll();

// Nothing to delete in initial application state
$('#btnDelete').hide();

// Register listeners
$('#btnSearch').click(function() {
	search($('#searchKey').val());
	return false;
});

$('.kill').click(function() {
	$('.blockForm').hide();
});
// Trigger search when pressing 'Return' on search key input field
$('#searchKey').keypress(function(e){
	if(e.which == 13) {
		search($('#searchKey').val());
		e.preventDefault();
		return false;
    }
});

$('#btnAdd').click(function() {
  $('.blockForm').show();
	newBlock();
	return false;
});

$('#btnSave').click(function() {
	if ($('#blockId').val() == '')
		addBlock();
	else
		updateBlock();
	return false;
});

$('#btnDelete').click(function() {
	deleteBlock();
	return false;
});

$('.block').on('click', function() {
	findById($(this).data('identity'));
  console.log($(this).data('identity'));
});

// Replace broken images with generic block bottle
$("img").error(function(){
  $(this).attr("src", "pics/generic.jpg");

});

function search(searchKey) {
	if (searchKey == '') 
		findAll();
	else
		findByDescription(searchKey);
}

function newBlock() {
	$('#btnDelete').hide();
	currentBlock = {};
	renderDetails(currentBlock); // Display empty form
}

function findAll() {
	console.log('findAll');
	$.ajax({
		type: 'GET',
		url: rootURL,
		dataType: "json", // data type of response
		success: renderBlocks
	});
}

function findByName(searchKey) {
	console.log('findByName: ' + searchKey);
	$.ajax({
		type: 'GET',
		url: rootURL + '/search/' + searchKey,
		dataType: "json",
		success: renderList 
	});
}

function findByDescription(searchKey) {
	console.log('findByDescription: ' + searchKey);
	$.ajax({
		type: 'GET',
		url: rootURL + '/search-extended/' + searchKey,
		dataType: "json",
		success: renderBlocks
	});
}

function findById(id) {
	console.log('findById: ' + id);
	$.ajax({
		type: 'GET',
		url: rootURL + '/' + id,
		dataType: "json",
		success: function(data){
			$('#btnDelete').show();
			console.log('findById success: ' + data.name);
			currentBlock = data;
			renderDetails(currentBlock);
		}
	});
}

function addBlock() {
	console.log('addBlock');
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: rootURL,
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){
			alert('Block created successfully');
			$('#btnDelete').show();
			$('#blockId').val(data.id);
      findAll();
      $('.blockForm').removeClass('active');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('addBlock error: ' + textStatus);
		}
	});
}

function updateBlock() {
	console.log('updateBlock', formToJSON());
	$.ajax({
		type: 'PUT',
		contentType: 'application/json',
		url: rootURL + '/' + $('#blockId').val(),
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){
			alert('Block updated successfully');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('updateBlock error: ' + textStatus);
		}
	});
}

function deleteBlock() {
	console.log('deleteBlock');
	$.ajax({
		type: 'DELETE',
		url: rootURL + '/' + $('#blockId').val(),
		success: function(data, textStatus, jqXHR){
			alert('Block deleted successfully');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('deleteBlock error');
		}
	});
}

function renderList(data) {
	// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
	var list = data == null ? [] : (data.block instanceof Array ? data.block : [data.block]);

	$('#blockList li').remove();
	$.each(list, function(index, block) {
		$('#blockList').append('<li><a href="#" data-identity="' + block.id + '">'+block.name+'</a></li>');
	});

}

function renderDetails(block) {
	$('#blockId').val(block.id);
	$('#name').val(block.name);
	$('#location').val(block.location);
	$('#height').val(block.height);
	$('#region').val(block.region);
	$('#year').val(block.year);
	$('#pic').attr('src', 'pics/' + block.picture);
	$('#description').val(block.description);
}

function renderBlocks(data) {
	var list = data == null ? [] : (data.block instanceof Array ? data.block : [data.block]);
  
  $('.block-list').remove();
  $('.block-area').append('<section class="block-list" />');

	$.each(list, function(index, block) {
    var blockHtml = $('<article data-identity="' + block.id + '" class="block block-large h' + block.height + ' w' + block.width + '" />');
    $('.block-list').append(blockHtml);

		blockHtml.append('<h1 class="block-name">'+block.name+'</h1>');
		blockHtml.append('<p>'+block.description+'</p>');      
	});

  $('.block-list').masonry({
    columnWidth: 300,
    itemSelector: '.block',
    "isFitWidth": true,
    gutter: 40
  });

}

// Helper function to serialize all the form fields into a JSON string
function formToJSON() {
	return JSON.stringify({
		"id": $('#blockId').val(), 
		"name": $('#name').val(), 
		"location": $('#location').val(),
		"height": $('#height').val(),
		"width": $('#width').val(),
		"region": $('#region').val(),
		"year": $('#year').val(),
		//"picture": currentBlock.picture,
		"description": $('#description').val()
		});
}
