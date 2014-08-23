  $(document).ready(function() {

    var timeline = Backbone.Model.extend({
      parse:function(data){
        var youtube = function(str){
            var youtube = str.match(/^\[.*\]/g)[0];
            var content = str.replace(/^\[.*\]/g, "");
            var obj = {};
            obj.content = content;
            obj.youtube = youtube.replace(/[\[\]]/g, "");;
            return obj;
          };
        var y = youtube(data.plain_content);
        var newFormat = {};
        newFormat.startDate = moment(data.post_date).format('YYYY,MM,DD');
        newFormat.endDate = moment(data.last_modify).format('YYYY,MM,DD');
        newFormat.headline = data.title;
        newFormat.text = y.content;
        newFormat.tag = data.title;
        newFormat.classname = data.title;
        newFormat.asset = {
          "media": y.youtube
          //"thumbnail":"optional-32x32px.jpg",
          //"credit":"Credit Name Goes Here",
          //"caption":"Caption text goes here"
        };
        return newFormat
      }
    });

    var List = Backbone.Collection.extend({

      model: timeline,

      sendData : {accessToken:"kp53f889d3632c23.40713927"},

      categoryID:'40',

      url:'http://api.kptaipei.tw/v1/category/',

      reset: function(models, options) {
        console.log("reset",models,options);
        options = options || {};
        Backbone.Collection.prototype.reset.call(this, models, options);
        if (!options.silent) {
            this.trigger('prereset', this, options);
        }
     },

      initialize: function(models, options){
          var self = this;
          $.ajax({
              type: "GET",
              url: this.url + this.categoryID,
              data: this.sendData,
              dataType: "json",
              success: function(data){
                  self.reset(data.data,{parse:true,silent:false});
              },
              error: function(jqXHR, textStatus, errorThrown){
                  console.log("FETCH FAILED: " + errorThrown);
              }
          });
      }
    });

    var a = new List();

    a.on('prereset',function(e){

    var newData = this.toJSON()

    console.log("prereset",newData);

    if(newData.length!=0){

      var data = {
                    "timeline":
                    {
                        "headline":"野生PK",
                        "type":"default",
                        "text":"<p>關於新市政</p>",
                        "asset": {
                            "media":"https://fbcdn-sphotos-d-a.akamaihd.net/hphotos-ak-xpa1/t31.0-8/c0.142.851.315/p851x315/10496064_486211841480801_2190785416260668124_o.jpg",
                            "credit":"Credit Name Goes Here",
                            "caption":"Caption text goes here"
                        },
                        "date": newData
                    }
                };

        console.log(data);

        createStoryJS({
          type:		'timeline',
          width:		'100%',
          height:		'800',
          //source:		'http://api.kptaipei.tw/v1/category/?accessToken=kp53f889d3632c23.40713927',
          source:data,//http://api.kptaipei.tw/v1/category/40?accessToken=kp53f889d3632c23.40713927',
          embed_id:	'my-timeline',
          lang:'zh-tw'
        });
    }

  });

    window.a = a;


  });
