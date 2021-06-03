
    const dojoOptions = {
      dojoConfig: {
        async: true,
        packages: [
          {
            location:
              "https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js",
            name: "Chart",
          },
        ],
      },
    };

    require([
        "esri/WebScene",
        "esri/views/SceneView",
        "esri/widgets/Feature",  
        "esri/layers/FeatureLayer",  
        "esri/Graphic",
        "esri/layers/ElevationLayer",
        "esri/layers/BaseElevationLayer",
        "esri/widgets/Home",
        "esri/widgets/Zoom",
        "esri/layers/TileLayer",
        "esri/layers/VectorTileLayer",  
        "esri/layers/SceneLayer",
        "esri/symbols/PolygonSymbol3D", 
        "esri/symbols/ExtrudeSymbol3DLayer",
        "esri/renderers/SimpleRenderer",  
        "esri/widgets/Legend",
        "esri/geometry/Point",
        "esri/widgets/Search",
        "esri/tasks/Locator",
        "esri/geometry/Polygon",
        "esri/core/watchUtils",
        "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.js",
        "dojo/domReady!",
          
      ], function(WebScene, SceneView, Feature, FeatureLayer, Graphic, ElevationLayer, BaseElevationLayer, Home, Zoom, TileLayer, VectorTileLayer, SceneLayer, PolygonSymbol3D, ExtrudeSymbol3DLayer, SimpleRenderer, Legend, Point, Search, Locator, Polygon, watchUtils, Chart) {


//***********Initiate Splash Modal**********//       
        
 
        
//***********Exaggerate Elevation x 2**********//          
          
        var ExaggeratedElevationLayer = BaseElevationLayer.createSubclass({
          properties: {
            exaggeration: 2
          },

          load: function() {
            this._elevation = new ElevationLayer({
              url:
                "//elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
            });

            this.addResolvingPromise(this._elevation.load());
          },
          fetchTile: function(level, row, col) {
            return this._elevation.fetchTile(level, row, col).then(
              function(data) {
                var exaggeration = this.exaggeration;
                for (var i = 0; i < data.values.length; i++) {
                  data.values[i] = data.values[i] * exaggeration;
                }
                return data;
              }.bind(this)
            );
          }
        });
        
//***********Add and Style Layers**********//

        var monVerticalOffset = {
            screenLength: 5,
            maxWorldLength: 100,
            minWorldLength: 70
        };

        var monRenderer = {
                type: "simple",
                symbol: {
                  type: "point-3d", 
                    symbolLayers: [
                      {
                        type: "icon",
                        material: {
                          color: [99, 99, 99]
                        },
                        size: 1,
                        outline: {
                          color: "#404040",
                          size: 0
                        }
                      }
                    ],

                    verticalOffset: monVerticalOffset,

                    callout: {
                      type: "line",
                      color: [0,0,0],
                      size: .5,
                      border: {
                        color: [255,255,255,0]
                      }
                    }
                  }
              };        
        
        const monLabel = new FeatureLayer ({
            url:"https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/Points_of_Interest/FeatureServer",
            renderer: monRenderer,
            maxScale: 0,
            visible: true,
            minScale: 12000,
            labelingInfo: [{
              labelExpressionInfo: {
                value: "{Descript}"
              },    
              labelPlacement: "above-center",    
              symbol: {
                type: "label-3d",
                symbolLayers: [{
                  type: "text",
                  horizontalAlignment: "right",    
                  material: {
                    color: [0, 0, 0]
                  },
                  halo: {
                    color: [255, 255, 255, 0.8],
                    size: 1
                  },
                  font: {
                    weight: "normal",
                    family: "Roboto Mono"
                  },
                      
                  size: 8,   
                }],
              } 
            }]
        });         
        
        const areaBounds = new FeatureLayer({
            url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/DC_2020_Project_Area/FeatureServer",
            maxScale: 0,
            minScale: 0,
            visible: true,
            elevationInfo: {
              mode: "on-the-ground",    
            },
            renderer: {
              
              type: "simple",
              symbol: {
                type: "simple-fill",
                color: [0, 0, 0, 0],
                outline: {
                  color: [0,0,0, 1],
                  width: 1,
                  style: "solid"    
                }
              }
            }
          });  
        
         const waterRender = {
              type: "simple",
              symbol: {
                type: "polygon-3d",
                symbolLayers: [{
                  type: "fill",
                  material: {
                    color: [32, 116, 168, 0.3]
                  }
                }]
              }
         };
           
         const waterLayer = new FeatureLayer({
          url:
            "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/Potomac_65/FeatureServer",
          elevationInfo: {
            mode: "on-the-ground",
            maxScale: 0,
            minScale: 0,
          },
          renderer: waterRender
        });
           
        const fort = new FeatureLayer({
            url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/DC_Forts/FeatureServer",
            maxScale: 0,
            minScale: 0,
            opacity: 0.8,
            definitionExpression: "Fort = 'Fort'",
            elevationInfo: {
              mode: "on-the-ground",    
            },
            renderer: {
              type: "simple",
              symbol: {
                type: "simple-fill", 
                color: [79, 79, 79, 0.1],
                outline: {
                  color: "#000",
                  width: 1.5,
                  style: "solid"    
                }
              }
            },
            popupEnabled: false,
            screenSizePerspectiveEnabled: false,
            labelingInfo: [{
              labelPlacement: "above-center",
              labelExpressionInfo: {
                value: "{FT_NAME}"
              },
              symbol: {
                type: "label-3d",
                symbolLayers: [{
                  type: "text",
                      
                  material: {
                    color: [0, 0, 0]
                  },
                  halo: {
                    color: [255, 255, 255, 0.8],
                    size: 1
                  },
                  font: {
                    weight: "bold",
                    family: "Raleway"
                  },
                  size: 8,   
                }],
                verticalOffset: {
                  screenLength: 60,
                  maxWorldLength: 700,
                  minWorldLength: 20
                },
                callout: {
                  type: "line",
                  size: 1,
                  color: [0, 0, 0],
                  border: {
                    color: [255, 255, 255, 0]
                  }
                }
              }
            }]
          });
          
          const battery = new FeatureLayer({
            url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/DC_Forts/FeatureServer",
            maxScale: 0,
            minScale: 0,
            opacity: 0.8,
            definitionExpression: "Fort <> 'Fort'",
            elevationInfo: {
              mode: "on-the-ground",    
            },
            renderer: {
              type: "simple",
              symbol: {
                type: "simple-fill", 
                color: [79, 79, 79, 0.5],
                outline: {
                  color: "#000",
                  width: 1,
                  style: "solid"    
                }
              }
            },
            popupEnabled: false,
            screenSizePerspectiveEnabled: false,
            labelingInfo: [{
              labelPlacement: "above-center",
              labelExpressionInfo: {
                value: "{FT_NAME}"
              },
              minScale: 15000,
              symbol: {
                type: "label-3d",
                symbolLayers: [{
                  type: "text",
                      
                  material: {
                    color: [0, 0, 0]
                  },
                  halo: {
                    color: [255, 255, 255, 0.8],
                    size: 1
                  },
                  font: {
                    weight: "bold",
                    family: "Raleway"
                  },
                  size: 6,   
                }],
                verticalOffset: {
                  screenLength: 30,
                  maxWorldLength: 500,
                  minWorldLength: 20
                },
                callout: {
                  type: "line",
                  size: 1,
                  color: [0, 0, 0],
                  border: {
                    color: [255, 255, 255, 0]
                  }
                }
              }
            }]
          });

        const fortBattOutlineOne = {              
          type: "simple",
          symbol: {
            type: "simple-fill",
            color: [0, 0, 0, 1],
            outline: {
              color: [0,0,0,0.2],
              width: 6,
              style: "solid"    
            }
          }
        } 
          
        const fortBattOutline = new FeatureLayer({
            url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/DC_Forts/FeatureServer",
            maxScale: 0,
            minScale: 0,
            opacity: 0.8,
            popupEnabled: false,
            elevationInfo: {
              mode: "on-the-ground",    
            },
            renderer: fortBattOutlineOne,
        });
            
        const trench = new FeatureLayer({
          url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/DC_Trenches/FeatureServer",
          maxScale: 0,
          minScale: 0,
          opacity: 0.9,    
          legendEnabled: false,
          visible: true,
          popupEnabled: false,   
          renderer: {
                type: "simple",
                symbol: {
                  color: "#000",
                  type: "simple-line",
                  style: "solid",
                  width: 2   
                }
            },
        });
          
        const trenchBack = new FeatureLayer({
          url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/DC_Trenches/FeatureServer",
          maxScale: 0,
          minScale: 0,
          opacity: 1,    
          legendEnabled: false,
          visible: true,
          popupEnabled: false,   
          renderer: {
                type: "simple",
                symbol: {
                  color: "#fff",
                  type: "simple-line",
                  style: "solid",
                  width: 6  
                }
            },
        });
        
        const rangeBuff = new FeatureLayer({
          url:
            "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/Range_Buffers_Text/FeatureServer",
          elevationInfo: {
            mode: "on-the-ground",

          },
          maxScale: 0,
          minScale: 0,
          definitionExpression: "FID_12 = 68",    
          renderer: {
              type: "simple",
              symbol: {
                type: "polygon-3d",
                symbolLayers: [{
                  type: "fill",
                  material: {
                    color: [64, 64, 64, 0.4]
                  }
                }]
              }
            }
        });
                  
        const dc1865 = new TileLayer ({
            url: "https://tiles.arcgis.com/tiles/uX5kr9HIx4qXytm9/arcgis/rest/services/DC_1865_Base_Map/MapServer",
            opacity: 0.7
        });
          
        const dc2020 = new VectorTileLayer ({
           url: "https://tiles.arcgis.com/tiles/uX5kr9HIx4qXytm9/arcgis/rest/services/2020_DC_Labels/VectorTileServer",
           opacity: 0.1,
           visible: true
        });
        
//***********Wash Mon Renderer**********//        
        
        var washMonEdges = {
          type: "solid",
          color: [0, 0, 0, 0.5],
          size: .5
        };
        
        var washMonSymbol = {
          type: "mesh-3d",
          symbolLayers: [
            {
              type: "fill",
              material: {
                color: [194, 194, 194, 0.7]
              },
              edges: washMonEdges
            }
          ]
        };          
          
        const washMonRenderer = {
            type: "simple",
            symbol: washMonSymbol
        };  
          
        const washMonUnFin = new SceneLayer({                    
            url:"https://tiles.arcgis.com/tiles/CmuSiXApoWtqLYty/arcgis/rest/services/Wash_Mon_UnFin/SceneServer",
            popupEnabled: false,
            renderer: washMonRenderer,
            visible: true
        });      
        
        const washMonFin = new SceneLayer({                    
            url:"https://tiles.arcgis.com/tiles/CmuSiXApoWtqLYty/arcgis/rest/services/Wash_Mon_Fin/SceneServer",
            popupEnabled: false,                         
            renderer: washMonRenderer,
            visible: false
        });

/******Forts Popup Test****/

      var fortsTemplate = {
        outFields: ["*"],
          //title: "{name_e}",
          content: function (feature) {
            return setContentInfo(feature.graphic.attributes);
        },    
      };  

      const fortsFootprint = new FeatureLayer({
        url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/Forts_Footprints/FeatureServer",
        maxScale: 0,
        minScale: 0,
        popupEnabled: false,
        outFields: ["*"],         
        opacity: 0,
        popupTemplate: fortsTemplate,
        elevationInfo: {
          mode: "on-the-ground",    
        }
      });            
        
      function setContentInfo(results) {
        var Albany = "<img id='frtImg' alt='Fort Albany' src='img/Fort_Albany.jpg'/>";
        var BunkerHill = "<img id='frtImg' alt='Fort Bunkerhill' src='img/Fort_BunkerHill.jpg'/>";
        var DeRussy = "<img id='frtImg' alt='Fort DeRussy' src='img/Fort_DeRussy.jpg'/>";
        var Saratoga = "<img id='frtImg' alt='Fort Saratoga' src='img/Fort_Saratoga.jpg'/>";
        var Thayer = "<img id='frtImg' alt='Fort Thayer' src='img/Fort_Thayer.jpg'/>";
        var Chain = "<img id='frtImg' alt='Battery Martin Scott / Chain Bridge Battery' src='img/Chain_Bridge_Battery.jpg'/>";
        var Bayard = "<img id='frtImg' alt='Fort Bayard' src='img/Fort_Bayard.jpg'/>";
        var CFSmith = "<img id='frtImg' alt='Fort C.F. Smith' src='img/Fort_CFSmith.jpg'/>";
        var Carroll = "<img id='frtImg' alt='Fort Carroll' src='img/Fort_Carroll.jpg'/>";
        var Corcoran = "<img id='frtImg' alt='Fort Corcoran' src='img/Fort_Corcoran.jpg'/>";
        var Craig = "<img id='frtImg' alt='Fort Craig' src='img/Fort_Craig.jpg'/>";
        var Ellsworth = "<img id='frtImg' alt='Fort Ellsworth' src='img/Fort_Ellsworth.jpg'/>";
        var Foote = "<img id='frtImg' alt='Fort Foote' src='img/Fort_Foote_NPS.jpg'/>";
        var Gaines = "<img id='frtImg' alt='Fort Gaines' src='img/Fort_Gaines.jpg'/>";
        var Jackson = "<img id='frtImg' alt='Fort Jackson' src='img/Fort_Jackson.jpg'/>";
        var Jameson = "<img id='frtImg' alt='Battery Jameson' src='img/Battery_Jameson.jpg'/>";
        var Lincoln = "<img id='frtImg' alt='Fort Lincoln' src='img/Fort_Lincoln.jpg'/>";
        var Lyon = "<img id='frtImg' alt='Fort Lyon' src='img/Fort_Lyon.jpg'/>";
        var Munson = "<img id='frtImg' alt='Fort Munson' src='img/Fort_Munson.jpg'/>";
        var Reno = "<img id='frtImg' alt='Fort Reno' src='img/Fort_Reno.jpg'/>";
        var Richardson = "<img id='frtImg' alt='Fort Richardson' src='img/Fort_Richardson.jpg'/>";
        var Rodgers = "<img id='frtImg' alt='Battery Rodgers' src='img/Battery_Rodgers.png'/>";
        var Runyon = "<img id='frtImg' alt='Fort Runyon' src='img/Fort_Runyon.jpg'/>";
        var Slemmer = "<img id='frtImg' alt='Fort Slemmer' src='img/Fort_Slemmer.jpg'/>";
        var Slocum = "<img id='frtImg' alt='Fort Slocum' src='img/Fort_Slocum.jpg'/>";
        var Stevens = "<img id='frtImg' alt='Fort Stevens' src='img/Fort_Stevens.jpg'/>";
        var Sumner = "<img id='frtImg' alt='Fort Sumner' src='img/Fort_Sumner.jpg'/>";
        var Totten = "<img id='frtImg' alt='Fort Totten' src='img/Fort_Totten.jpg'/>";
        var Whipple = "<img id='frtImg' alt='Fort Whipple' src='img/Fort_Whipple.jpg'/>"; 
        var Woodbury = "<img id='frtImg' alt='Fort Woodbury' src='img/Fort_Woodbury.jpg'/>"; 
        
        var image = (
            results.FT_NAME == 'Fort Albany' ? Albany :
            results.FT_NAME == 'Fort Bunker Hill' ? BunkerHill :
            results.FT_NAME == 'Fort DeRussy' ? DeRussy :
            results.FT_NAME == 'Fort Saratoga' ? Saratoga :
            results.FT_NAME == 'Fort Thayer' ? Thayer :
            results.FT_NAME == 'Battery Martin Scott' ? Chain :
            results.FT_NAME == 'Fort Bayard' ? Bayard :
            results.FT_NAME == 'Fort C. F. Smith' ? CFSmith :
            results.FT_NAME == 'Fort Carroll' ? Carroll :
            results.FT_NAME == 'Fort Corcoran' ? Corcoran :
            results.FT_NAME == 'Fort Craig' ? Craig :
            results.FT_NAME == 'Fort Ellsworth' ? Ellsworth :
            results.FT_NAME == 'Fort Foote' ? Foote :
            results.FT_NAME == 'Fort Gaines' ? Gaines :
            results.FT_NAME == 'Fort Jackson' ? Jackson :
            results.FT_NAME == 'Battery Jameson' ? Jameson :
            results.FT_NAME == 'Fort Lincoln' ? Lincoln :
            results.FT_NAME == 'Fort Lyon' ? Lyon :
            results.FT_NAME == 'Fort Munson' ? Munson :
            results.FT_NAME == 'Fort Reno' ? Reno :
            results.FT_NAME == 'Fort Richardson' ? Richardson :
            results.FT_NAME == 'Battery Rodgers' ? Rodgers :
            results.FT_NAME == 'Fort Runyon' ? Runyon :
            results.FT_NAME == 'Fort Slemmer' ? Slemmer :
            results.FT_NAME == 'Fort Slocum' ? Slocum :
            results.FT_NAME == 'Fort Stevens' ? Stevens :
            results.FT_NAME == 'Fort Sumner' ? Sumner :
            results.FT_NAME == 'Fort Totten' ? Totten :
            results.FT_NAME == 'Fort Whipple' ? Whipple :
            results.FT_NAME == 'Fort Woodbury' ? Woodbury :
            ''
        );
        
        var credit = (
            (results.FT_NAME == 'Battery Martin Scott' || results.FT_NAME == 'Fort Bayard' || results.FT_NAME == 'Fort C. F. Smith' || results.FT_NAME == 'Fort Carroll' || results.FT_NAME == 'Fort Corcoran' || results.FT_NAME == 'Fort Craig' || results.FT_NAME == 'Fort Ellsworth' || results.FT_NAME == 'Fort Gaines' || results.FT_NAME == 'Fort Jackson' || results.FT_NAME == 'Fort Lincoln' || results.FT_NAME == 'Fort Lyon' || results.FT_NAME == 'Fort Munson' || results.FT_NAME == 'Fort Reno' || results.FT_NAME == 'Fort Richardson' || results.FT_NAME == 'Battery Rodgers' || results.FT_NAME == 'Fort Runyon' || results.FT_NAME == 'Fort Slemmer' || results.FT_NAME == 'Fort Slocum' || results.FT_NAME == 'Fort Stevens' || results.FT_NAME == 'Fort Sumner' || results.FT_NAME == 'Fort Totten' || results.FT_NAME == 'Fort Whipple' || results.FT_NAME == 'Fort Woodbury' || results.FT_NAME == 'Fort Albany' ||
            results.FT_NAME == 'Fort Bunker Hill' || results.FT_NAME == 'Fort DeRussy' || results.FT_NAME == 'Fort Saratoga' || results.FT_NAME == 'Fort Thayer' || results.FT_NAME == 'Battery Jameson') ? "<b>Image credit:</b> Library of Congress" :
            results.FT_NAME == 'Fort Foote' ? "<b>Image credit:</b> National Park Service" :
            ''
        );
        
        var armsTotalNum = results.c6lbJam + results.c6lbField + results.c10lbParr + results.c12lbField + results.c12lbHow + results.c12lbJam + results.c12lbHvy + results.c12lbNap + results.c20lbParr + results.c24lbBarb + results.mCoMort +results.c24lbParr + results.c24lbHow + results.c24lbSiege + results.c30lbParr + results.c32lbBarb + results.c32lbSea + results.c32lbHow + results.c32lbParr + results.c42lbJam + results.c100lbParr + results.c200lbParr + results.c4inRif + results.c45inOrd + results.c5inSiege + results.c8inHow + results.m8inMort + results.c10inMort + results.c15inRdm;
        
        var fullDetails = "<div id='popupContainer'><span id='fortPic'>" + image + "</span><h5>" + credit + "</h5><h2>" + results.FT_NAME + "</h2><h3><b>Type:</b> " + results.Fort + "</h3><h3><b>Year Constructed:</b> " + results.YrBuilt + "</h3><hr><h3><b>Commanding Officer:</b> " + results.Comm + "</h3><h3><b>Garrison:</b> " + results.Garr + "</h3><h3><b>Armaments:</b> " + results.Arms + results.ArmsTwo + "( <b>" + armsTotalNum + " Total Guns</b> )</h3><h3><b>Range Info:</b> Of the guns at " + results.FT_NAME + ", the " + results.Lng_Range + " had the longest range at <b>" + results.Rng_Meters + " meters</b> (5° elevation).</h3><table><tbody><tr><td><label class='switch'><input type='checkbox' id='popupButton'><span class='slider round'></span></label></td><td><h3 id='switchText' class='switch'>Show <b>" + results.Lng_Range + "</b> maximum range</h3></td></tr></tbody></table><h3><b>Notes:</b> " + results.Notes + results.NotesTwo + "</h3><div class='chart'></div><h4><b>Information Source:</b><a href='https://www.nps.gov/parkhistory/online_books/civilwar/hrsa1-e.htm' target='_blank'> " + results.Source + "</a></h4></div>";
                
        var someDetails = "<div id='popupContainer'><span>" + image + "</span><h5>" + credit + "</h5><h2>" + results.FT_NAME + "</h2><h3><b>Type:</b> " + results.Fort + "</h3><h3><b>Year Constructed:</b> " + results.YrBuilt + "</h3><hr><h3><b>Notes:</b> " + results.Notes + results.NotesTwo + "</h3></div>";
        
        var zeroDetails = "<div id='popupContainer'><h2>" + results.FT_NAME + "</h2><h3><b>Type:</b> " + results.Fort + "</h3><h3><b>Year Constructed:</b> Unknown</h3><hr><h3><b>Notes:</b> Additional details about this fortified position are not known at this time.</h3></div>";
                
        var popupChoice = (
            results.Comm === ' ' && results.YrBuilt != 0 ? someDetails :
            results.Comm === ' ' && results.YrBuilt === 0 ? zeroDetails :
            fullDetails
        );
        
        var popupElement = document.getElementById("sidebarDiv");
                
        popupElement.innerHTML = popupChoice;
        
        //Range SWITCH CODE///
        
        var rangeId = results.FID_12;
        
        $('#popupButton').change(function(){
            if ($(this).is(':checked')) {
                rangeBuff.visible = true;
                rangeBuff.definitionExpression = "FID_12 = " + rangeId;
                $("#switchText").html("Hide <b>" + results.Lng_Range + "</b> maximum range");
            } else {
                //rangeBuff.definitionExpression = "FID_12 = 1000";
                rangeBuff.visible = false;
                $("#switchText").html("Show <b>" + results.Lng_Range + "</b> maximum range");
            }
        });
        
        //Chart Data and Labels//
        
        let arms = [
            {name: "6lb James Rifled", number: results.c6lbJam}, 
            {name: "6lb Field Gun", number: results.c6lbField}, 
            {name: "10lb Parrott", number: results.c10lbParr}, 
            {name: "12lb Field Gun", number: results.c12lbField}, 
            {name: "12lb Howitzer", number: results.c12lbHow}, 
            {name: "12lb James Rifled", number: results.c12lbJam}, 
            {name: "12lb Heavy Gun", number: results.c12lbHvy}, 
            {name: "12lb Napoleon", number: results.c12lbNap}, 
            {name: "20lb Parrott", number: results.c20lbParr}, 
            {name: "24lb Barbette", number: results.c24lbBarb}, 
            {name: "24lb Coehorn Mortar", number:results.mCoMort}, 
            {name: "24lb Parrott", number: results.c24lbParr}, 
            {name: "24lb Howitzer", number: results.c24lbHow}, 
            {name: "24lb Siege Gun", number: results.c24lbSiege}, 
            {name: "30lb Parrott", number: results.c30lbParr}, 
            {name: "32lb Barbette", number: results.c32lbBarb}, 
            {name: "32lb Sea Coast", number: results.c32lbSea}, 
            {name: "32lb Howitzer", number: results.c32lbHow}, 
            {name: "32lb Parrott", number: results.c32lbParr}, 
            {name: "42lb James Rifled", number: results.c42lbJam}, 
            {name: "100lb Parrott", number: results.c100lbParr}, 
            {name: "200lb Parrott", number: results.c200lbParr}, 
            {name: "4 inch Rifle", number: results.c4inRif}, 
            {name: "4-5 inch Ord.", number: results.c45inOrd}, 
            {name: "5 inch Siege Gun", number: results.c5inSiege}, 
            {name: "8 inch Howitzer", number: results.c8inHow}, 
            {name: "8 inch Mortar", number: results.m8inMort}, 
            {name: "10 inch Mortar", number: results.c10inMort}, 
            {name: "15 inch Rodmanr", number: results.c15inRdm}
        ];

        let armsCount = arms.filter(arms => arms.number > 0);
        
        var armsNumber = armsCount.map(a => a.number);
        var armsName = armsCount.map(a => a.name);
        
        var fortName = results.FT_NAME;
        
        //Start Chart
        
        var canvas = document.createElement("canvas");

        var data = {
          labels: armsName,       
          datasets:[
            {
              label: "Number:",
              data: armsNumber, 
              //data: arms.filter(checkArms),  
              backgroundColor: 'rgba(186, 169, 169, 0.6)',
              borderColor: 'rgba(110, 100, 76, 1)',
              borderWidth: .5,
              hoverBorderWidth: 1,
              hoverBackgroundColor: 'rgba(186, 169, 169, 0.8)',
            },
          ],
          };

          var options = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Type and Number of Guns at ' + fortName + ' (May 1864)',
                fontSize: 13,
            },
            scales: {
                xAxes: [{
                    //stacked: true
                    ticks: {
                        fontSize: 12,
                        fontColor: "#000",
                        beginAtZero: true
                    }
                }],
                yAxes: [{
                    //stacked: true,
                    ticks: {
                        //beginAtZero: true,
                        fontSize: 12,
                        fontColor: "#000",           
                    }
                }]
            },
            tooltips: {
                backgroundColor: 'rgba(201, 184, 139, 0.9)',
                titleFontFamily: "'Raleway'",
                bodyFontFamily: "'Raleway'",
                titleFontColor: "#000",
                bodyFontColor: "#000",
                cornerRadius: 3,
                borderWidth: 2,
                mode: 'index',
                intersect: false
            },
            /*hover: {
                    onHover: function(e) {
                        var point = this.getElementAtEvent(e);
                        if (point.length) e.target.style.cursor = 'pointer';
                        else e.target.style.cursor = 'default';
                    }
            }*/
        };
    
        Chart.Legend.prototype.afterFit = function() {
            this.height = this.height + 10;
        };

        Chart.defaults.global.defaultFontFamily="'Raleway'";
        var mybarChart = new Chart(canvas, {
          type: "horizontalBar",
          data: data,
          options: options,   
        });

        popupElement.querySelector(".chart").appendChild(canvas); 
        
        //End Chart
                
        return popupElement;                        
    };

//***********3d Forts**********//
          
        var fortEdges = {
          type: "solid",
          color: [0, 0, 0, 0.5],
          size: .5
        };   
          
        var yr1861 = {
          type: "mesh-3d",
          symbolLayers: [
            {
              type: "fill",
              material: {
                color: "#ff5200"
              },
              edges: fortEdges    
            } 
          ]  
        };
          
        var yr1862 = {
          type: "mesh-3d",
          symbolLayers: [
            {
              type: "fill",
              material: {
                color: "#fa9905"
              },
              edges: fortEdges    
            } 
          ]  
        };
        
        var yr1863 = {
          type: "mesh-3d",
          symbolLayers: [
            {
              type: "fill",
              material: {
                color: "#f21170"
              },
              edges: fortEdges    
            } 
          ]  
        }
          
        var yr1864 = {
          type: "mesh-3d",
          symbolLayers: [
            {
              type: "fill",
              material: {
                color: "#72147e"
              },
              edges: fortEdges    
            } 
          ]  
        }  
          
        const fort3dYearRenderer = {
          type: "unique-value",
          defaultSymbol: {
            type: "mesh-3d",
            symbolLayers: [
              {
                type: "fill", 
                material: {
                  color: "#baa9a9" // color for forts with no year data #8e7f7f
                },
                edges: fortEdges  
              }
            ]
          },
          field: "YrBuilt",
          uniqueValueInfos: [
            {
              value: 1861,
              symbol: yr1861,
            },
            {
              value: 1862,
              symbol: yr1862,
            },
            {
              value: 1863,
              symbol: yr1863,
            },
            {
              value: 1864,
              symbol: yr1864,
            },  
          ],
        };  
                                  
        const forts3d = new SceneLayer({                    
            url:"https://tiles.arcgis.com/tiles/CmuSiXApoWtqLYty/arcgis/rest/services/3d_Forts_FINAL_V5/SceneServer",
            popupEnabled: false,                          
            renderer: fort3dYearRenderer,
        });
                                   
//***********Set Scene**********//
          
       var webscene = new WebScene({
            layers: [ dc2020, dc1865, waterLayer, trenchBack, fortBattOutline, trench, battery, fort, areaBounds, rangeBuff, fortsFootprint, forts3d, washMonFin, washMonUnFin, monLabel ],
            ground: {
                layers: [new ExaggeratedElevationLayer()]
            }
        });
          
        webscene.ground.opacity = 0  
        
       /*webscene.when(function () {
            webscene.ground.opacity = 0;
        })*/ 

        var view = new SceneView({
          container: "viewDiv",
          map: webscene,
          viewingMode: "global",   
          padding: {
            left: 320         
          },    
          qualityProfile: "high",
          alphaCompositingEnabled: true,
          popup: {
              collapseEnabled: false,
              dockOptions: {
                  buttonEnabled: false,
                  breakpoint: {
                      height: 1000
                  }
              } 
          },    
          environment: {
            background:{
                type: "color", 
                color: [0, 0, 0, 0]
            },
            lighting: {
              directShadowsEnabled: true,
              date: new Date("Sun Mar 15 1865 09:00:00 GMT-0600 (CET)")    
            },
            atmosphereEnabled: false,
            starsEnabled: false
          },
          ui: {
              components: [""]
          },    
          camera: {
            position: {
              latitude: 38.6735,   
              longitude: -77.1848,    
              z: 21623.4
            },
            tilt: 47.76,
            heading: 24.61
          },
          constraints: {
              altitude: {
                min: 2000,
                max: 55000,
                //tilt: 100
              },
              /*tilt: {
                  max: 75
              }*/
            }    
        });
          
        view.popup.viewModel.actions = false; 
        
        view.watch('camera.tilt', function(newValue, oldValue, property, object) {
          console.log(property , newValue);
        });
          
        view.watch('camera.position', function(newValue, oldValue, property, object) {
          console.log(property , newValue);
        });
          
        view.watch('camera.heading', function(newValue, oldValue, property, object) {
          console.log(property , newValue);
        });

//********Send popup contents to sidebar*********//   
        
        view.when().then(function() {
              const graphic = {
                popupTemplate: {
                  content: ""
                }
              };

            const feature = new Feature({
                container: "feature-node",
                graphic: graphic,
                map: view.webscene,
                spatialReference: view.spatialReference
            });    

            view.whenLayerView(fortsFootprint).then(function(layerView) {
                let highlight;
                view.on("click", function(event) {   
                  view.hitTest(event).then(function(event) {
                    let results = event.results.filter(function(result) {
                      return result.graphic.layer.popupTemplate;
                    });
                    let result = results[0]; 
                    highlight && highlight.remove();
                    rangeBuff.visible = false;
                    rangeBuff.definitionExpression = "FID_12 = 1000";  
                    if (result) {
                      feature.graphic = result.graphic;
                      buffId = result.FID_12;
                      highlight = layerView.highlight(result.graphic);
                      $("#infoButton").removeClass('esri-icon-question-clicked');    
                      toggleNum = 1;    
                    } else { 
                      document.getElementById("sidebarDiv").innerHTML = "<div class='banner'><div class='line'><span class='fancy'>Select a Fort</span></div><div class='line'><span class='fancySmall'>And</span></div><div class='line'><span class='fancy'>Start Exploring</span></div></div>";
                      rangeBuff.definitionExpression = "FID_12 = 1000";
                      rangeBuff.visible = false;
                      $("#infoButton").removeClass('esri-icon-question-clicked');
                      toggleNum = 1;
                    }
                    $(document).ready(function(){
                        $("#infoButton").click(function(){
                            highlight.remove(result.graphic);
                        })
                    });
                    addSearch.clear();
                  });
                });
                addSearch.on("select-result", function (event) {
                  let result = event.result.feature;      

                  view.hitTest(event).then(function () {
                    feature.graphic = result;
                    highlight.remove(result.graphic);    
                  });
                });                  
            });
        }); 
        
//***********Opacity Tools**********//

        var range = $('.input-range'),
            value = $('.range-value'),
            hidden = $('.hidden-value');

        value.html(range.attr('value') + "%");
        hidden.val(range.attr('value'));

        range.on('input', function(){
            value.html(this.value + "%");
            hidden.val(this.value);
        });    
            
        var opacitySlider = document.getElementById("opacSlider");
        opacitySlider.oninput = function() {
            dc1865.opacity = this.value/100;
            waterLayer.opacity = this.value/100;
            dc2020.opacity = this.value*100;
        }   
        
//***********Reset Opacity**********//          
          
        $(document).ready(function(){
          $("#opacButton").click(function(){
              dc2020.opacity = 0.1;
              dc1865.opacity = 0.7;
              waterLayer.opacity = 1;
              value.html(range.attr('value') + "%");
              opacitySlider.value = 50;
          })
         });
        
//***********Adjust UI**********//        

        var zoom = new Zoom({
            view: view,
            layout: "horizontal",
            container: "zoomButtons"
        });   
        
       var homeBtn = new Home({
            view: view,
            container: "homeButton"
        });
          
        view.ui.add(homeBtn, "manual");   
        view.ui.add(zoom, "manual");
        
//***********Add Search************/

var addSearch = new Search({
  view: view,
  includeDefaultSources: false,
  locationEnabled: false,
  maxSuggestions: 20,
  sources: [
      {
          layer: fortsFootprint,
          searchFields: ["FT_NAME"],
          displayField: "FT_NAME",
          exactMatch: false,
          placeholder: "Enter a fort name",
          name: "Enter a fort name"
      }
    ],
    container: "addSearch",
    popupEnabled: false,
}); 

/*var addSearch = new Search({
  view: view,
  includeDefaultSources: false,
  container: "addSearch",
  popupEnabled: false,   
  locationEnabled: false,   
  sources: [
    {
      locator: new Locator({
        url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" 
      }),
      filter: {
        geometry: new Polygon({
            "rings": [
              [
                [
              -77.068068,
              39.022396
            ],
            [
              -76.877254,
              38.873726
            ],
            [
              -77.04778,
              38.740017
            ],
            [
              -77.23878,
              38.889099
            ]
              ]
            ],
            "spatialReference": {
              "wkid": 4326
            }
          }) 
      },
      name: "Search by Address or Place",
      placeholder: "Enter an Address",
      zoomScale: 4000,
        resultSymbol: {
            type: "simple-marker",  
            style: "circle",
            color: [255, 255, 255, 0.3],
            size: 16, 
            outline: { 
            color: [0,0,0, 0.6],
            width: 3
            }                  
        }   
    }  
  ]
});*/

//***********DC1865 On/Off**********//          
        
        $('#layerButton').change(function(){
            if ($(this).is(':checked')) {
                dc1865.visible = true;
                monLabel.visible = true;
                waterLayer.visible = true;
                dc2020.opacity = 0.1;
                dc1865.opacity = 0.7;
                waterLayer.opacity = 1;
                washMonFin.visible = false;
                washMonUnFin.visible = true;
                $("#histMap").html("1865 Barnard Map <b class='heavy'>ON</b>");
                $("#sliderText").css({"opacity":1});
                document.getElementById("opacSlider").disabled = false;
                $("#opacButton").css({'pointer-events': 'all'});
                $("#opacButton").css({'hover-events': 'all'});
                $("#opacButton").css({'opacity': 1});                
                $('.range-slider').css({"opacity":1});
                $('.range-slider').css({'pointer-events': 'all'})
            } else {
                dc1865.visible = false;
                monLabel.visible = false;
                waterLayer.visible = false;
                dc2020.opacity = 0.7;
                washMonFin.visible = true;
                washMonUnFin.visible = false;
                $("#histMap").html("1865 Barnard Map <b class='heavy'>OFF</b>");
                $("#sliderText").css({"opacity":0.4});
                document.getElementById("opacSlider").disabled = true;
                $("#opacButton").css({'pointer-events': 'none'});
                $("#opacButton").css({'hover-events': 'none'});
                $("#opacButton").css({'opacity': 0.4});
                $('.range-slider').css({"opacity":0.4});
                $('.range-slider').css({'pointer-events': 'none'});
                value.html(range.attr('value') + "%");
                opacitySlider.value = 50;
            }
        });
        
//***********Toggle Info Section**********//   

       var toggleNum = 1;
        
       $(document).ready(function(){ 
          $("#infoButton").click(function(){
            if (toggleNum == 1) {
            document.getElementById("sidebarDiv").innerHTML = "<div id='popupContainer'><img id='frtImg' alt='Lincoln Hospital' src='img/Lincoln_Hosp.jpg'><h5><b>Image credit:</b> Library of Congress</h5><h2>About the Map</h2><h3>This application was created in an effort to better understand the ring of fortifications that protected Washington DC from Confederate attacks during the American Civil War of 1861-65. Through an innovative combination of both historic and present day maps, 3D models, images and historic data, this application creates an immersive environment in which to understand the Civil War-era defenses of the nation’s capital.</h3><h3><b>How to Use the Map:</b></h3><h3>On loading, the application presents the user with a view of a heavily fortified Washington, DC in 1865. In a 3D environment, the user can pan and zoom around the District and its immediate environs. Click on individual forts, redoubts and batteries to see images and information on commanding officers, garrisons and armaments at each location. For most fortifications, the user can also turn on the maximum range of the most powerful gun at each place. Adjust the opacity of the 1865 basemap or turn it on and off to see how the fortifications relate to present day Washington, DC, Northern Virginia and Maryland.</h3><h3><b>A Note on Information and Data</b></h3><h3>This process of creating this application began with the acquisition of the 1865 <a href='https://www.loc.gov/resource/g3851s.cw0676000/?r=0.378,0.341,0.207,0.113,0' target='_blank'><i>Map of the environs of Washington : compiled from Boschkes' map of the District of Columbia and from surveys of the U.S. Coast Survey showing the line of the defences of Washington as constructed during the war from 1861 to 1865 inclusive</i></a> from the Library of Congress and its alignment with the geography and elevation data of today. Garrison and armament information for individual forts, including gun ranges, was acquired from the <a href='https://www.nps.gov/parkhistory/online_books/civilwar/hrsa1-e.htm' target='_blank'>National Park Service</a> while images are from the <a href='https://loc.gov/' target='_blank'>Library of Congress</a>. All 1865 map georeferencing, geospatial data - including 3D fort models- and present-day vector tiles were created by the author of this application.</h3><h3>Copyright © 2021 <a href='https://www.danielhwatts.com/' target='_blank'>Daniel H. Watts</a></h3></div>";
            $("#infoButton").toggleClass('esri-icon-question-clicked');
            rangeBuff.definitionExpression = "FID_12 = 1000";
            toggleNum = 2;   
            } else if (toggleNum == 2) {
            document.getElementById("sidebarDiv").innerHTML = "<div class='banner'><div class='line'><span class='fancy'>Select a Fort</span></div><div class='line'><span class='fancySmall'>And</span></div><div class='line'><span class='fancy'>Start Exploring</span></div></div>";
            $("#infoButton").toggleClass('esri-icon-question-clicked');
            toggleNum = 1;
            }
          });
        });
               
//*************Modal Code**************//
        
        var modal = document.getElementById("myModal");

        //var img = document.getElementById("myImg");
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        $(document).on("click", "#frtImg" , function() {
          modal.style.display = "block";
          modalImg.src = this.src;

        var imgCredit = (
          (this.alt == 'Battery Martin Scott / Chain Bridge Battery' || this.alt == 'Fort Bayard' || this.alt == 'Fort C. F. Smith' || this.alt == 'Fort Carroll' || this.alt == 'Fort Corcoran' || this.alt == 'Fort Craig' || this.alt == 'Fort Ellsworth' || this.alt == 'Fort Gaines' || this.alt == 'Fort Jackson' || this.alt == 'Fort Lincoln' || this.alt == 'Fort Lyon' || this.alt == 'Fort Munson' || this.alt == 'Fort Reno' || this.alt == 'Fort Richardson' || this.alt == 'Battery Rodgers' || this.alt == 'Fort Runyon' || this.alt == 'Fort Slemmer' || this.alt == 'Fort Slocum' || this.alt == 'Fort Stevens' || this.alt == 'Fort Sumner' || this.alt == 'Fort Totten' || this.alt == 'Fort Whipple' ||this.alt == 'Fort Woodbury' || this.alt == 'Fort Albany' ||
          this.alt == 'Fort Bunker Hill' || this.alt == 'Fort DeRussy' || this.alt == 'Fort Saratoga' || this.alt == 'Fort Thayer' || this.alt == 'Battery Jameson' || this.alt == 'Lincoln Hospital' ) ? "Image credit: Library of Congress" :
          this.alt == 'Fort Foote' ? "Image credit: National Park Service" :
          ''
        );
          captionText.innerHTML = `${this.alt}  |  ${imgCredit}`;
        });

        var span = document.getElementsByClassName("close")[0];

        span.onclick = function() {
          modal.style.display = "none";
        }
        
        modal.onclick = function() {
          modal.style.display = "none";
        }

//*****************Splash Screen***************//
        
        $(document).ready(function(){
          $("#closeButton").click(function(){
            $(".splashBack").fadeToggle(300);
          });
        }); 
        
//***************Open/Close Menu Button*************//

      $(".toggle").click(function() {
        //addSearch.clear();
        $(".toggle").toggleClass('toggle-clicked');
        $(".sidebarTop").toggleClass('sidebarTop-clicked');
        $(".sidebarBottom").toggleClass('sidebarBottom-clicked');
      });


    addSearch.on("search-clear", function(event) {
      document.getElementById("sidebarDiv").innerHTML = "<div class='banner'><div class='line'><span class='fancy'>Select a Fort</span></div><div class='line'><span class='fancySmall'>And</span></div><div class='line'><span class='fancy'>Start Exploring</span></div></div>";
    });
      
/**********End Edits**********/

});



        
 