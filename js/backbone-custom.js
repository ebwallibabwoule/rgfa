(function($) {

    _.extend(Backbone.Validation.patterns, {
        zip: /[0-9]{4} *[a-z]{2}/i
    });
    
    _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);    

    var Router = Backbone.Router.extend({
        routes: {
            "": "test",
            "block/:id":"blockDetails",
            "test": "test",
            "form": "form",
            "information": "information"            
        },
        blockDetails: function (id) {
            if (this.blockList) {
                this.block = this.blockList.get(id);
                //if (this.BlockView) this.blockView.close();
                this.blockView = new BlockView({model:this.block});
                $('.content').html(this.blockView.render().el);
            } else {
                this.requestedId = id;
                this.list();
            }
        }        
    });
	

    
    var BlockModel = Backbone.Model.extend({
        urlRoot: "../rfga/api/block",
        default: {
          id: null,
          description: "tekst",	
          height: "",
          location: "",
          name: "Titel",
          picture: "",
          region: "",
          width: "",
          year: ""
        }
    });

    var BlockCollection = Backbone.Collection.extend({
        model: BlockModel,
        url:"../rfga/api/blocks"
    });

    
    
    var TestView = Backbone.View.extend({
        el: ".content",        
        initialize: function(){
            _.templateSettings.variable = "object";
          

		  this.getBlocks();

		  
        },
        render: function(){
			
            //this.getBlocks();
        },
        getBlocks: function() {
            var that = this;
            this.collection = new BlockCollection();
            this.collection.fetch({
                success: function(collection, response, options) {
                    console.log(response["block"]);
                    that.$el.html(_.template($("#block-area").html(), {blocks: response["block"]}));
                    
                    that.$el.masonry({
                      columnWidth: 300,
                      itemSelector: '.block',
                      "isFitWidth": true,
                      gutter: 40
                    });
  
                }
            })
			
        },
        search: function() {
			console.log("search");
          
        }
    });

    var BlockView = Backbone.View.extend({
        el: ".wrapper",
        events: {
            "click .block > *":"getBlock",
            "click #btnSave":"saveBlock",
            "click #btnDelete":"deleteBlock",
            "click .button-add":"newBlock",
            "click .kill":"closeBlock"
        },              
        initialize: function(){
            _.templateSettings.variable = "object";
	
           // this.getBlock();
								
        },
        render: function(){
            //this.getBlock();
        },
        getBlock: function(event) {
            id = $(event.target).parents(".block").data("id");
            console.log(id);

            //$(".block-form").show();
            var that = this;
            this.block = new BlockModel({id: id});
            this.block.fetch({
                success: function(collection, response, options) {
                    that.$el.append(_.template($("#block-form").html(), {block: response}));
                }
            })


        },
        saveBlock: function(event) {
            event.preventDefault();
            this.block.set({
                name: $('#name').val(),
                width: $('#width').val(),
                year: $('#year').val(),
                description: $('#description').val(),
				height: $('#height').val(),
				location: $('#location').val(),
				region: $('#region').val()
         	});
            if (this.block.isNew()) {

            } else {
                this.block.save();	
                //var testView = new TestView();
            }
		
        },
        deleteBlock: function(event) {
            event.preventDefault();
            this.block.destroy();
         
        },
        newBlock: function() {
            var block = new BlockModel();
        },
        closeBlock: function() {
            $(".block-form").remove();
        },
        testest: function() {
            console.log("S");
        }
    });

    
    var router = new Router();

    router.on("route:test", function() {

		var testView = new TestView(); 
		var blockView = new BlockView({}); 
		
				  testView.collection.on('change',testView.search,this);

    });
      
    /*
    
	 // Router
	var AppRouter = Backbone.Router.extend({
	 
		routes:{
			"":"list",
			"block/new":"newBlock",
			"block/:id":"blockDetails"
		},
	 
		initialize:function () {
			//$('#header').html(new HeaderView().render().el);
		},
	 
		list:function () {
			this.blockList = new BlockCollection();
			var that = this;
			this.blockList.fetch({
				success:function () {
					that.testView = new TestView({model:that.blockList});
					//$('.content').html(that.testView.render().el);
					if (that.requestedId) that.blockDetails(that.requestedId);
				}
			});
		},
	 
		blockDetails:function (id) {
			if (this.blockList) {
				this.block = this.blockList.get(id);
				if (this.blockView) this.blockView.close();
				this.blockView = new BlockView({model:this.block});
				$('.wrapper').append(this.blockView.render().el);
			} else {
				this.requestedId = id;
				this.list();
			}
		},
	 
		newBlock:function () {
			if (app.blockView) app.blockView.close();
			app.blockView = new BlockView({model:new Block()});
			$('.wrapper').append(app.blockView.render().el);
		}
	 
	});
	 
	var app = new AppRouter();  
*/

    Backbone.history.start();

})(jQuery);