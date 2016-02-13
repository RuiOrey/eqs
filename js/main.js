//hover on table


    var positionEquations ={

            speedTN : 0.3,
            accTN : 0.0,
            oldPosTN : 0.0,
            actualPosTN: 0.0

        };

    var camera2;
    var sensorView = false;
    var time;
    var oldTime = Date.now();
    var clock = new THREE.Clock();
    clock.start();
    clock.getDelta();
    var plane;
    var sky, sunSphere;

    var sensorCylinder;

    var scene, camera, camera, renderer, cameraHelper, cameraEye;
    var geometry, material, mesh, controls;
    var cylinder;
    var textureMap, materialPlane;
    var plane;

    var pathTube;

    var material;

    var olPositionMarker;
    var olPositionLayer;


    var binormal = new THREE.Vector3();
    var normal = new THREE.Vector3();
    var closed2 = true;
    var parent;
    var tube, tubeMesh,tubeMesh2;
    var animation = false,
        lookAhead = false;
    var scale = 1;
    var showCameraHelper = false;

    var down = false;
    $(document).mousedown(function() {
        down = true;
    }).mouseup(function() {
        down = false;
    });


    var travelStartTime = 0.0;

    var travelFinishTime = 1.0;

    var travelActualRelativeTime = 0.0;

    var travelActualAbsoluteTime = Date.now();

    //milliseconds elapsed since 1 January 1970 00:00:00 UTC
    var travelAbsoluteStartTime = Date.now();

    var personalizedTravel = false;

    var matrixTest = newSquareMatrix(100);

    var normalizedPositions = false;

    var computedRotations = false;

    var pipelineSpline;

    var activeSensor = -1;
    var travelCamera = true;

    var sphere;

    var repositionedSensors = false;

    var viewFirstPerson = true;

    var cameraAttached = true;

    var scene2;

    var scene3;


    var controlVar = {

        startSensor: 1,

        endSensor: 8,
        //novo
        stop_go: true,

        travelCamera: true,

        upperCamera: true,

        viewFirstPerson: true,

        cameraAttached: true,

        speed: 1.0,

        position: 0.0,

        releaseCamera: function() {

            controlVar.cameraAttached = !controlVar.cameraAttached;

            if (!controlVar.cameraAttached)
                $("#release").text("Attach Camera");
            else
                $("#release").text("Release Camera");
        },

        swapView: function() {

            controlVar.travelCamera = !controlVar.travelCamera;

            if (!controlVar.travelCamera)
                camera.position.set(-555.5198524853896, -855.9061905143088, -1538.6897620032673);
        },



        upCamera: function() {

            controlVar.upperCamera = !controlVar.upperCamera;

            //if (!controlVar.upperCamera)
            //  camera.position.set(-555.5198524853896, -855.9061905143088, -1538.6897620032673);
        },

        startTravel: function() {


            if (normalizedPositions) {

                alert("Start travel");

                travelFinishTime = pipeline.sensors[controlVar.endSensor - 1].normalizedTime;

                travelStartTime = pipeline.sensors[controlVar.startSensor - 1].normalizedTime;

                personalizedTravel = true;

                travelAbsoluteStartTime = Date.now();

            }
        }

    };


$(document).ready(function() {
    $('tr').mouseover(function() {
        var valueOfTd = $(this).find('td:first-child').text();
        console.log("over");

        if (activeSensor !== "") {
            activeSensor = valueOfTd;
            $("#markerO" + (parseInt(activeSensor - 1))).click();
            sensorView = false;
        } 
    });
});


    //get distance from two points given lat and long 
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);

        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km

        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    //latlon to mercator - check if compatible with gmaps or google function exists
    function LatLonToMercator(lat, lon) {
        var rMajor = 6378137; //Equatorial Radius, WGS84
        var shift = Math.PI * rMajor;
        var x = lon * shift / 180;
        var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
        y = y * shift / 180;

        return {
            'x': x,
            'y': y
        };
    }

    //latlon to mercator - check if compatible with gmaps or google function exists
    function MercatorToLatLon(x, y) {
        var x1 = pipeline.sensors[0].x + x;
        var y1 = pipeline.sensors[0].y + y;
        var rMajor = 6378137; //Equatorial Radius, WGS84
        var shift = Math.PI * rMajor;

        y = y1 / shift * 180;

        var lat = y * (Math.PI / 180);

        lat = Math.exp(lat);
        lat = Math.atan(lat) / (Math.PI / 360);

        var temp = lat;

        lat = -(90 - temp);

        var lon = x1 / shift * 180;

        return {
            'lat': lat,
            'lon': lon
        };
    }


    //pipeline JSON
    var pipeline = {

        pipe: [

            {
                idPoint: 1,
                latitude: -8.6333,
                longitude: 41.0667
            },

            {
                idPoint: 2,
                latitude: -8.6333,
                longitude: 41.08
            },

            {
                idPoint: 3,
                orderInLine: 3,
                latitude: -8.62,
                longitude: 41.08
            }

        ]

        ,

        sensors: [

            {
                idSensor: 1,
                idPipeline: 1,
                idLinha: 1,
                latitude: -8.6333,
                longitude: 41.0667,
                orderInLine: 1,
                typeSensor: 1,
                angleRadians :0.0
                //distance to begining probably should be infered from start point
            },

            {
                idSensor: 2,
                idPipeline: 1,
                idLinha: 1,
                latitude: -8.6333,
                longitude: 41.069,
                orderInLine: 2,
                typeSensor: 2,
                angleRadians :0.0
                //distance to begining probably should be infered from start point
            },

            {
                idSensor: 3,
                idPipeline: 2,
                idLinha: 1,
                latitude: -8.6333,
                longitude: 41.072,
                orderInLine: 3,
                typeSensor: 1,
                angleRadians :0.0
                //distance to begining probably should be infered from start point
            },

            {
                idSensor: 4,
                idPipeline: 3,
                idLinha: 1,
                latitude: -8.6333,
                longitude: 41.075,
                orderInLine: 4,
                typeSensor: 1,
                angleRadians : 0.0
                //distance to begining probably should be infered from start point
            },

            {
                idSensor: 5,
                idPipeline: 4,
                idLinha: 1,
                latitude: -8.6333,
                longitude: 41.079,
                orderInLine: 5,
                typeSensor: 1,
                angleRadians : 0.0
                //distance to begining probably should be infered from start point
            },

            {
                idSensor: 6,
                idPipeline: 5,
                idLinha: 1,
                latitude: -8.63,
                longitude: 41.08,
                orderInLine: 6,
                typeSensor: 2,
                angleRadians :0.0
                //distance to begining probably should be infered from start point
            },

            {
                idSensor: 7,
                idPipeline: 6,
                idLinha: 1,
                latitude: -8.625,
                longitude: 41.08,
                orderInLine: 7,
                typeSensor: 1,
                angleRadians :0.0
                //distance to begining probably should be infered from start point
            },

            {
                idSensor: 8,
                idPipeline: 6,
                idLinha: 1,
                latitude: -8.62,
                longitude: 41.08,
                orderInLine: 8,
                typeSensor: 2,
                angleRadians :0.0
                //distance to begining probably should be infered from start point
            }
        ]

    };
    
    function newSquareMatrix(dim) {
        var x = new Array(dim);

        for (var i = 0; i < 100; i++) {
            x[i] = new Array(100);
        }
        //x[5][12] = 3.0;
        return x;

    }



 function computeRotationsPipes(){

    for (var actualSensorTemp = 0 ; actualSensorTemp < pipeline.sensors.length; actualSensorTemp++ )
{
        var i = pipeline.sensors[actualSensorTemp].normalizedTime;

            var pos = tube.parameters.path.getPointAt(i);        

        if ( i < 1.0 )
            var pos2 = tube.parameters.path.getPointAt(i+0.01);
        else
            var pos2 = tube.parameters.path.getPointAt(i-0.01);

      

            var angleRadians = Math.atan2(pos2.y - pos.y, pos2.x - pos.x);

            pipelineCubes[actualSensorTemp].rotation.y = angleRadians;

            console.log("angleRadians " + angleRadians);

            pipelineCubes[actualSensorTemp].position.z -=5 ;



            }

            computedRotations = true;

 }

    window.onload = function() {

        console.log("gui adding");
        var gui = new dat.GUI();

        var f0 = gui.addFolder('Camera');

       // gui.add(controlVar, 'speed', 0, 5);
        f0.add(controlVar, 'swapView').name('Distant / Travel Camera');;
        f0.add(controlVar, 'releaseCamera').name('Free / Attached Camera');;

        //novo
    // gui.add(controlVar, 'position', 0, 1).listen();

        //novo
        

        f0.add(controlVar, 'upCamera').name(' Up / Inside camera');;

        var f1 = gui.addFolder('Travel');

        f1.add(controlVar, 'startSensor').min(controlVar.startSensor).max(controlVar.endSensor).step(1).name('Start Sensor');;
        f1.add(controlVar, 'endSensor').min(controlVar.startSensor).max(controlVar.endSensor).step(1).name('Destination Sensor');;
        f1.add(controlVar, 'startTravel').name('Start!');;


        var f2 = gui.addFolder('Movement Parameters');

        f2.add(positionEquations,  'speedTN', 0, 50).step(0.001).listen().name('Speed');;
        f2.add(positionEquations, 'accTN',0,5).step(0.001).listen().name('Acceleration');;
        f2.add(positionEquations, 'actualPosTN',0,1).step(0.001).listen().name('Position (0-1)');;
        f2.add(controlVar, 'stop_go').name('Unlock Position');

        f2.open();

        

    };



    //for now let's assume the first sensor is the 0
    var sensorStart = pipeline.sensors[0];
    var pipelineVectors = [];
    var pipelineCubes = [];

    function addGeometry(geometry, geometry2, color) {

        // 3d shape

        tubeMesh = THREE.SceneUtils.createMultiMaterialObject(

            geometry, [

                material,

                materialInside

                
            ]
        );


        tubeMesh2 = THREE.SceneUtils.createMultiMaterialObject(

            geometry2, [
                //materialInside
                 new THREE.MeshBasicMaterial({

                    side: THREE.FrontSide,
                    color: 0xffffff,
                    transparent:true,
                    opacity: 0.0
                    //wireframe: true,
                    //wireframeLinewidth: 0.1
                }),


                    ]
        );

        scene.add(tubeMesh);

        tubeMesh2.scale.set(scale  , scale , scale );
        
        scene.add(tubeMesh2);

        tubeMesh.position.z = -5;

        tubeMesh2.position.z = -5;

        tubeMesh2.visible=false;


        var position = new THREE.Vector3(5.499603531284312, -333.5608756974456, -14.99999999253307);
        var direction = new THREE.Vector3(0, 1, 0);
        var dimensions = new THREE.Vector3(10, 10, 10);
        var check = new THREE.Vector3(0, 0, 0);
        var decalDiffuse = THREE.ImageUtils.loadTexture('oil-gas-chemical.jpg');

        decalDiffuse.minFilter = THREE.LinearFilter;

        var decalMaterial = new THREE.MeshPhongMaterial({
            transparent: true,
            map: decalDiffuse,
            depthTest: true,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: -4
                //side: THREE.BackSide

        });

        var geometry = new THREE.BoxGeometry(90, 90, 90);
        var materialCube = new THREE.MeshBasicMaterial({

            color: 0x00ff00,
            transparent: true,
            depthTest: true,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: -4,

        });

        var meshT = new THREE.Mesh(geometry, materialCube);

        var decalGeometry = new THREE.DecalGeometry(
            meshT, // it has to be a THREE.Geometry   
            position, // THREE.Vector3 in world coordinates  
            direction, // THREE.Vector3 specifying the orientation of the decal  
            dimensions, // THREE.Vector3 specifying the size of the decal box  
            check // THREE.Vector3 specifying what sides to clip (1-clip, 0-noclip)  
        );

        var m = new THREE.Mesh(decalGeometry, materialCube);

    }

    function setScale() {
        tubeMesh.scale.set(scale, scale, scale);
    }

    function computeNormalizedPositionOfSensorsInTube() {

        normalizedPositions = false;

        pipeline.sensors[0].normalizedTime = 0.0;

        var timeActual = 0.0;

        var actualSensorTemp = 1;

        pipeline.sensors[actualSensorTemp].normalizedTime = 0.0;

        //distance from 0 to the first sensor
        var distanceActual = pipeline.sensors[actualSensorTemp].MercatorVector.distanceTo(tube.parameters.path.getPointAt(0));

        for (var i = 0.001; i < 1.0; i = i + 0.001)

        {
            //distance from time i to sensor actualSensorTemp
            var distanceTemp = pipeline.sensors[actualSensorTemp].MercatorVector.distanceTo(tube.parameters.path.getPointAt(i));

            //if distance is less than actual, replaces, else changes to next
            if (distanceTemp < distanceActual) {
                console.log("less");
                pipeline.sensors[actualSensorTemp].normalizedTime = i;
                distanceActual = pipeline.sensors[actualSensorTemp].MercatorVector.distanceTo(tube.parameters.path.getPointAt(i));

            } else {

                console.log("actualSensor:" + actualSensorTemp + " i:" + i + " distanceTemp" + distanceTemp);
                actualSensorTemp++;
                console.log("plus");
                distanceActual = pipeline.sensors[actualSensorTemp].MercatorVector.distanceTo(tube.parameters.path.getPointAt(i));
            }

            if (actualSensorTemp === pipeline.sensors.length - 1) {
                i++;
                pipeline.sensors[actualSensorTemp].normalizedTime = 1.0;
            }

        }

        normalizedPositions = true;
    }

    function addTube() {
        pathTube = THREE.TubeGeometry.FrenetFrames(pipelineSpline, 200, !closed2);

        tube = new THREE.TubeGeometry(pipelineSpline, 200, 20, 20, !closed2);

        var tube2 = new THREE.TubeGeometry(pipelineSpline, 200, 30, 20, !closed2);



        addGeometry(tube, tube2, 0xff00ff);

        setScale();

        computeNormalizedPositionOfSensorsInTube();
    }

    function buildPipelineGL() {

        pipelineVectors = [];

        var startXY = LatLonToMercator(pipeline.sensors[0].latitude, pipeline.sensors[0].longitude);

        for (var i = 0; i < pipeline.sensors.length; i++) {
            var thisXY = LatLonToMercator(pipeline.sensors[i].latitude, pipeline.sensors[i].longitude);
            pipelineVectors.push(new THREE.Vector3(thisXY.x - startXY.x, thisXY.y - startXY.y, 0));
        }

        console.log(pipelineVectors);
        pipelineSpline = new THREE.CatmullRomCurve3(pipelineVectors);
        addTube();

    }


    var selectedSensor = function(id) {

        console.log("interacting with sensor" + id);

        //sensorView = false;

        //console.log( "id == activeSensor:" + (id == activeSensor) );

        if ( id !== activeSensor ){
        
            sensorView = true;

        }

        else {

            sensorView = !sensorView;

           // alert(sensorView);

        }
     

        activeSensor= id;

        if (pipelineCubes[id] !== undefined) {

                                for (var i = 0; i < pipelineCubes.length; i++) {
                                    pipelineCubes[i].material.transparent = true;
                                }

                                pipelineCubes[id].material.transparent = false;
                            }

        var pipes = pipelineCubes[activeSensor].position;
        camera2.position.set (pipes.x,pipes.y,pipes.z);

        console.log( "id" + id + " rotation:" + pipeline.sensors[activeSensor].angleRadians );

        camera2.position.z = -130;

        camera2.lookAt(pipelineCubes[activeSensor].position);
            
        camera2.rotation.z = -pipelineCubes[activeSensor].angleRadians;

       
    }

    
    var loadedTiles = 0;

    var map;

    function initMap1() {

        map = new ol.Map({

            target: 'mapo',

            renderer: 'canvas',

            visible: true,

            layers: [

                new ol.layer.Tile({

                    source: new ol.source.MapQuest({
                        layer: 'osm'
                    })

                }),

                new ol.layer.Tile({

                    source: new ol.source.MapQuest({
                        layer: 'hyb'
                    })
                })

            ],

            view: new ol.View({

                center: ol.proj.fromLonLat([-8.6333, 41.0667]),

                zoom: 15,

                maxZoom: 21

            })

        });

        map.on('postrender', function(event) {
            loadedTiles++;

        });


        function createMarker(sensor, id) {

            var marker = "marker";

            if (sensor.typeSensor === 2) {

                marker = "marker2"

            }


            map.addOverlay(new ol.Overlay({

                position: ol.proj.transform(

                    [sensor.latitude, sensor.longitude],

                    'EPSG:4326',

                    'EPSG:3857'

                ),

                element: $('<img class="location-popover" src="assets/img/' + marker + '.png" id ="markerO' + id + '">')
                    .css({

                        marginTop: '-200%',

                        marginLeft: '-50%',

                        cursor: 'pointer'

                    })
                    .popover({

                        'placement': 'top',

                        'html': true,

                        'content': '<strong>Sensor ' + (id + 1) + '</strong>'

                    })
                    .on('click',

                        function(e) {

                            $(".location-popover").not(this).popover('hide');

                            console.log("Sensor " + id + " clicked!");

                            //novo 
                            selectedSensor(id);
                        })

            }));


            if (id !== 0) {

                var lon1 = pipeline.sensors[id - 1].longitude;
                var lat1 = pipeline.sensors[id - 1].latitude;
                var lon2 = pipeline.sensors[id].longitude;
                var lat2 = pipeline.sensors[id].latitude;



                var coordinates = [
                    [lon1, lat1],
                    [lon2, lat2]
                ];

                var featureLine = new ol.Feature({
                    geometry: new ol.geom.LineString(coordinates)
                });

                var sourceLine = new ol.source.Vector({
                    features: [featureLine]
                });

                var vectorLine = new ol.layer.Vector({
                    source: sourceLine
                });

                map.addLayer(vectorLine);

            }


        }



        $.each(pipeline.sensors, function(i, data) {

            createMarker(data, i);

            if (i !== 0) {

                var lon1 = pipeline.sensors[i - 1].longitude;
                var lat1 = pipeline.sensors[i - 1].latitude;
                var lon2 = pipeline.sensors[i].longitude;
                var lat2 = pipeline.sensors[i].latitude;

                var coordinates = [
                    [lon1, lat1],
                    [lon2, lat2]
                ];

                var featureLine = new ol.Feature({
                    geometry: new ol.geom.LineString(coordinates)
                });

                var sourceLine = new ol.source.Vector({
                    features: [featureLine]
                });

                var vectorLine = new ol.layer.Vector({
                    source: sourceLine
                });

                map.addLayer(vectorLine);

            }

        });


        olPositionMarker = new ol.Overlay({

            position: ol.proj.transform(

                [0, 0],
                'EPSG:4326',
                'EPSG:3857'

            ),

            element: $('<img class="location-popover" src="assets/img/gps-01-512.png">')
                .css({

                    width: '10%',
                    height: '10%',
                    marginTop: '-10%',
                    marginLeft: '-4%',
                    cursor: 'pointer'

                })
                .popover({

                    'placement': 'top',
                    'html': true,
                    'content': '<strong>Position</strong>'

                })
                .on('click',

                    function(e) {
                        $(".location-popover").not(this).popover('hide');
                    })

        });


        map.addOverlay(olPositionMarker);





        map.on('singleclick', function(evt) {

            var coord = evt.coordinate;

            var transformed_coordinate = ol.proj.transform(coord, "EPSG:4326", "EPSG:3857");

            console.log(transformed_coordinate);

        });
    }
   
    for (square in matrixTest) {

        square = new THREE.Color(Math.random() * 0xffffff);

    }

    init();
    initSky();
    window.addEventListener('resize', onWindowResize, false);
    animate();

  function init() {


        container = document.getElementById('webgl');

        $("#messages").show();


        scene = new THREE.Scene();

       // scene.fog =  new THREE.Fog(0xffffff, 10, 1000);

        scene2 = new THREE.Scene();

        scene3 = new THREE.Scene();

       // scene2.fog =  new THREE.Fog(0xffffff, 10, 600);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000000);
        camera.position.z = 50;

        camera.position.set(-248.17757723999148, -1281.321697144117, 2493.681669720094);

        camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);

         camera2.position.set(-248.17757723999148, -1281.321697144117, 2493.681669720094);


        renderer = new THREE.WebGLRenderer();

        //renderer.setClearColor( 0xff0000 );

              //renderer.setSize(window.innerWidth, window.innerHeight);
        //alert(window.innerWidth);
        //alert(window.innerHeight);
        var width = document.getElementById('webgl').offsetWidth;
        var height = document.getElementById('webgl').offsetHeight
        renderer.setSize(width, height);

        container.appendChild(renderer.domElement);

        container.addEventListener('resize', onWindowResize, false);

        controls = new THREE.TrackballControls(camera, document.getElementById('webgl'));

        //novo
        renderer.autoClearDepth = false;

        renderer.autoClearColor = false;

        renderer.sortObjects = false;

        /*
        geometry = new THREE.BoxGeometry( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
  */

        var ambientLight = new THREE.AmbientLight( 0xffffdd);
        scene.add(ambientLight);



        var lights = [];
        lights[0] = new THREE.PointLight(0xffffff, 1, 0);
        lights[1] = new THREE.PointLight(0xffffff, 1, 0);
        lights[2] = new THREE.PointLight(0xffffff, 1, 0);

        lights[0].position.set(0, 200, 0);
        lights[1].position.set(100, 200, 100);
        lights[2].position.set(-100, -200, -100);

        scene.add(lights[0]);
        scene.add(lights[1]);
        scene.add(lights[2]);

        

        var geometry = new THREE.BoxGeometry(9, 9, 9);
        var materialCube = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        var cube = new THREE.Mesh(geometry, materialCube);



        geometry = new THREE.SphereGeometry(40, 32, 32);

        sphere = new THREE.Mesh(geometry, materialCube);

        scene.add(sphere);


        /*---------------------------

        CYLINDER INIT

        -----------------------------*/





        var loader = new THREE.ObjectLoader();
        loader.load('/assets/model.json', function(geometry) {

            //var mesh = new THREE.Mesh( geometry, material );

            sensorCylinder = geometry;

            //     scene.add( geometry );

        });





        /*----------------------

      SKYBOX INIT

      ----------------------*/



/*
        var textureEquirec;

        textureEquirec = THREE.ImageUtils.loadTexture("skydome.jpg");

        textureEquirec.format = THREE.RGBAFormat;

        textureEquirec.mapping = THREE.EquirectangularReflectionMapping;

        textureEquirec.magFilter = THREE.LinearFilter;

        textureEquirec.minFilter = THREE.NearestFilter;

        var equirectShader = THREE.ShaderLib["equirect"];

        var equirectMaterial = new THREE.ShaderMaterial({
            fragmentShader: equirectShader.fragmentShader,
            vertexShader: equirectShader.vertexShader,
            uniforms: equirectShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });

        equirectMaterial.uniforms["tEquirect"].value = textureEquirec;

        var geometry = new THREE.BoxGeometry(10000, 10000, 10000);

        var skybox = new THREE.Mesh(geometry, equirectMaterial);

        */

        //scene.add(skybox);

        //var texture = THREE.ImageUtils.loadTexture( "threejs/textures/terrain/backgrounddetailed6.jpg" );

       var texture = THREE.ImageUtils.loadTexture("/texture/rusted-metal-COLOR.png");

        texture.wrapS = THREE.MirroredRepeatWrapping;

        texture.wrapT = THREE.MirroredRepeatWrapping;

        texture.repeat.set(50, 1);

        texture.minFilter = THREE.LinearFilter;

        //texture.anisotropy = renderer.getMaxAnisotropy() / 2;

        //texture.needsUpdate = true;

        var textureBump = THREE.ImageUtils.loadTexture("/texture/rusted-metal-BUMP.png");

        textureBump.wrapS = THREE.MirroredRepeatWrapping;

        textureBump.wrapT = THREE.MirroredRepeatWrapping;

        textureBump.repeat.set(50, 1);

        textureBump.minFilter = THREE.LinearFilter;

        // textureBump.needsUpdate = true;


        var textureao = THREE.ImageUtils.loadTexture("/texture/rusted-metal-OCC.png");

        textureao.wrapS = THREE.MirroredRepeatWrapping;

        textureao.wrapT = THREE.MirroredRepeatWrapping;

        textureao.repeat.set(50, 1);

        textureao.minFilter = THREE.LinearFilter;

        //textureao.needsUpdate = true;


        var textureNormal = THREE.ImageUtils.loadTexture("/texture/rusted-metal-NRM.png");

        textureNormal.wrapS = THREE.MirroredRepeatWrapping;

        textureNormal.wrapT = THREE.MirroredRepeatWrapping;

        textureNormal.repeat.set(50, 1);

        textureNormal.minFilter = THREE.LinearFilter;

        // textureNormal.needsUpdate = true;




        var geometry = new THREE.CylinderGeometry(5, 5, 50, 32, 1, true);

        material = new THREE.MeshPhongMaterial({


            side: THREE.FrontSide,
            shading: THREE.SmoothShading,
            // map: texture,
            //bumpMap: textureBump,
            //aoMap: textureao,
            //  normalMap: textureNormal,
            color: 0xaaaaaa,
            // combine: THREE.AddOperation,
            //envMap: textureEquirec

        });

        materialInside = new THREE.MeshPhongMaterial({


            side: THREE.BackSide,
            shading: THREE.SmoothShading,
            map: texture,
               bumpMap: textureBump,
            // aoMap: textureao,
             normalMap: textureNormal,
            transparent : false,
            color: 0xaa7777,


        });

        material.transparent = true;
        material.opacity = 0.1;

        cylinder = new THREE.Mesh(geometry, material);

        // cylinder.rotateX(Math.PI/2)

        //cylinder.rotateY(Math.PI/2)

        // scene.add(cylinder);


        /*-----------------------

        PIPELINE

        -----------------------*/

        //add sensors to table


        $.each(pipeline.sensors, function(i, data) {



            var distanceFromStart = getDistanceFromLatLonInKm(sensorStart.latitude, sensorStart.longitude, data.latitude, data.longitude);

            data["distanceFromStart"] = distanceFromStart;

            //Mercator coordinates
            var XY = LatLonToMercator(data.latitude, data.longitude);

            data["x"] = XY.x;

            data["y"] = XY.y;

            //difference between start and actual sensor Mercator Coords
            var xCoord = data["x"] - pipeline.sensors[0].x;

            var yCoord = data["y"] - pipeline.sensors[0].y;
            //alert(xCoord + " " + yCoord);

            var geometry = new THREE.BoxGeometry(50, 50, 50);
            if (data.typeSensor === 2)
                var material = new THREE.MeshBasicMaterial({
                    color: 0x0000ff
                });
            else
                var material = new THREE.MeshBasicMaterial({
                    color: 0xff0000
                });

            material.transparent = true;
            material.opacity = 0.3;
            var cube = new THREE.Mesh(geometry, material);


           // scene.add(cube);

            data["3D"] = cube;

            var loader = new THREE.ObjectLoader();
            loader.load('/assets/model2.json', function(geometry) {

                //var mesh = new THREE.Mesh( geometry, material );

                sensorCylinder = geometry;

                sensorCylinder.position.set(xCoord, yCoord, 0);

                //novo
                sensorCylinder.rotateZ( Math.PI / 2 ) ;

                 scene2.add(sensorCylinder);

                data["3D"] = sensorCylinder;

                pipelineCubes.push(data["3D"]);

            });

            //cube = sensorCylinder.clone();


            data["MercatorVector"] = new THREE.Vector3(xCoord, yCoord, 0);

            cube.position.set(xCoord, yCoord, 0);



            //pipelineVectors.push(data["MercatorVector"]);

            $("#sensors").append(

                "<tr> <td>" + data.idSensor +
                "</td> <td>" + data.idSensor +
                "</td> <td>" + data.idPipeline +
                "</td> <td>" + data.idLinha +
                // "</td> <td>" + data.idPipeline +
                "</td> <td>" + (data.latitude).toFixed(2) +
                "</td> <td>" + (data.longitude).toFixed(2) +
                "</td> <td>" + data.orderInLine +
                "</td> <td>" + data.typeSensor +
                "</td> <td>" + (data.distanceFromStart).toFixed(2) +
                "</td></tr>");

            //alert( i );


            //when all are ready
            if (i === pipeline.sensors.length - 1) {



                buildPipelineGL();

            }

        });


        /*

        var position = new THREE.Vector3(0, 0, 0);

        var direction = new THREE.Vector3(1, 0, 0);

        var dimensions = new THREE.Vector3(10, 10, 10);

        var check = new THREE.Vector3(0, 0, 0);

        var decalDiffuse = THREE.ImageUtils.loadTexture('oil-gas-chemical.jpg');

        decalDiffuse.minFilter = THREE.LinearFilter;

        var decalMaterial = new THREE.MeshPhongMaterial({
            transparent: true,
            map: decalDiffuse,
            depthTest: true,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: -4,
            side: THREE.BackSide

        });

        var geometry = new THREE.BoxGeometry(9, 9, 9);
        var materialCube = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        var cube = new THREE.Mesh(geometry, materialCube);


        var decalGeometry = new THREE.DecalGeometry(

            tube, // it has to be a THREE.Geometry   

            position, // THREE.Vector3 in world coordinates  

            direction, // THREE.Vector3 specifying the orientation of the decal  

            dimensions, // THREE.Vector3 specifying the size of the decal box  

            check // THREE.Vector3 specifying what sides to clip (1-clip, 0-noclip)  

        );

        var m = new THREE.Mesh(decalGeometry, decalMaterial);

        scene.add(m);
*/




        controls.rotateSpeed = 3.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;



        renderer.setClearColor(new THREE.Color(0xccccdd));



    }

    function loadMapToPlane() {

        var canvas = $('#mapo').children("div").children("canvas")[0];

        textureMap = new THREE.Texture(canvas);

        textureMap.magFilter = THREE.NearestFilter;
        textureMap.repeat.set(1, 1);

        // optimise texture quality, use half the maximum anisotropy, at least 1
        textureMap.anisotropy = Math.ceil(renderer.getMaxAnisotropy() / 2);
        textureMap.needsUpdate = true;

        loadedTiles = 0;
    }


    function moveCamera() {

        //novo
        var deltaT = clock.getDelta() ;
        //console.log("deltaT:" + deltaT);

        

     
        if ( controlVar.stop_go )
            {
                time = ( Date.now() - travelAbsoluteStartTime );
                travelAbsoluteStartTime += deltaT;

                controlVar.position += deltaT * controlVar.speed;

                positionEquations.speedTN += positionEquations.accTN * deltaT * 2;

                if ( positionEquations.speedTN > 50) {

                    positionEquations.speedTN = 50;

                }

                positionEquations.actualPosTN = positionEquations.oldPosTN + deltaT * (positionEquations.speedTN /100.0)  ;
               // console.log( "positionEquations.actualPosTN:" +  positionEquations.actualPosTN );
                
                if ( positionEquations.actualPosTN > 1.00000 ) {
                    
                 //   console.log(">1" );
                    positionEquations.actualPosTN = 0.0;

                }



            }
            else
            travelAbsoluteStartTime +=  Date.now() - oldTime;

        if (controlVar.position > 1.0)
            controlVar.position=0;

        //console.log(time);
        oldTime = Date.now();

        positionEquations.oldPosTN = positionEquations.actualPosTN;
     

        //time in miliseconds
        var looptime = 20 * 10000 / controlVar.speed;

        var t;

        t = (time % looptime) / looptime;

        //novo 
        t = positionEquations.actualPosTN;

        //console.log(t);

        //for personalized travel
        if (personalizedTravel) {

            var timeTravelWindow = travelFinishTime - travelStartTime;

            //normalization of t
            t = t * timeTravelWindow;

          //  console.log("normalized:" + t );

            t = travelStartTime + t;

          //  console.log("normalized + start:" + t );

        }

        // t has reached the end
        if ((t > travelFinishTime && travelStartTime < travelFinishTime) || (t < travelFinishTime && travelStartTime > travelFinishTime))
            travelAbsoluteStartTime = Date.now();

        //saves actual time for eventual external operations
        travelActualRelativeTime = t;

        travelActualAbsoluteTime = time;

    // t = controlVar.position;


        if (t >= 0 && t <= 1)
            var pos = tube.parameters.path.getPointAt(t);
        else
            if (t < 0)
                var pos = tube.parameters.path.getPointAt(0);
            else
                var pos = tube.parameters.path.getPointAt(1);

        pos.multiplyScalar(scale);

        // interpolation
        var segments = tube.tangents.length;
        if (t >= 1){
            t=1;}
        if (t <= 0){
            t=0.01;}
        var pickt = t * segments;
        var pick = Math.floor(pickt);
        //console.log(t);
        if (t >= 1){
                    pickNext = pick =  pick-1;}
        var pickNext = (pick + 1) % segments;
        

        binormal.subVectors(tube.binormals[pickNext], tube.binormals[pick]);
        binormal.multiplyScalar(pickt - pick).add(tube.binormals[pick]);


        var dir = tube.parameters.path.getTangentAt(t);

        var offset = 15;

        normal.copy(binormal).cross(dir);

        // We move on a offset on its binormal
        pos.add(normal.clone().multiplyScalar(offset));


        for (var i = 0; i < pipelineCubes.length; i++) {
            //novo
            if (sensorView) {
                        pipelineCubes[i].rotateY(0.01);
            }
        }




        var latslongs = MercatorToLatLon(pos.x, pos.y);
        // console.log( "lat:" + latslongs.lat + " lon:" + latslongs.lon );

        if (map !== undefined && olPositionMarker !== undefined) {
            olPositionMarker.setPosition(ol.proj.transform([latslongs.lat, latslongs.lon], 'EPSG:4326', 'EPSG:3857'));

            map.getView().setCenter(ol.proj.transform([latslongs.lat, latslongs.lon], 'EPSG:4326', 'EPSG:3857'));

        }

        if (sphere !== undefined)
            sphere.position.copy(pos);
        // cameraEye.position.copy( pos );


        // Camera Orientation 1 - default look at
        // camera.lookAt( lookAt );
        if (controlVar.cameraAttached && sensorCylinder !== undefined) {


            //sensorCylinder.up.set(0, 1, 0);

            // sensorCylinder.position.copy(pos);
            //sensorCylinder.lookAt(pos)

            if (controlVar.travelCamera) {

                camera.position.copy(pos);


                //if (!down){


                // Using arclength for stablization in look ahead.
                var pointTem = (t + 30 / tube.parameters.path.getLength()) % 1 ;

                pointTem = Math.min( 1, pointTem );

                var lookAt = tube.parameters.path.getPointAt(pointTem).multiplyScalar(scale);

                if (travelStartTime > travelFinishTime) {

                    pointTem = (t - 30 / tube.parameters.path.getLength()) % 1 ;

                    console.log(pointTem);

                    pointTem = Math.max( 0, pointTem );

                    lookAt = tube.parameters.path.getPointAt(pointTem).multiplyScalar(scale);

                    dir.x = -dir.x;

                    dir.y = -dir.y;

                }



                // Camera Orientation 2 - up orientation via normal
                if (!lookAhead)
                    lookAt.copy(pos).add(dir);



                camera.matrix.lookAt(camera.position, lookAt, normal);

                camera.rotation.setFromRotationMatrix(camera.matrix, camera.rotation.order);
                //}
                if (controlVar.upperCamera)
                    camera.position.z -= 20;


                //sensorCylinder.matrix.lookAt(sensorCylinder.position, lookAt, normal);
                //sensorCylinder.up = camera.up;
                /*sensorCylinder.quaternion.set(
    camera.quaternion.x,
    -camera.quaternion.y,
    -camera.quaternion.z,
    camera.quaternion.w
);
*/
                // sensorCylinder.rotation.setFromRotationMatrix(sensorCylinder.matrix, sensorCylinder.rotation.order);

            } else {

                //camera.position.set(-555.5198524853896,  -855.9061905143088,  -1538.6897620032673);
                camera.lookAt(sphere.position);

            }
        }
    }

    function animate() {

        if ( tubeMesh2 !== undefined ){

                
                tubeMesh.visible = true;
                tubeMesh2.visible = false;
                plane.visible = true;
           
            }

        moveCamera();

        if (!repositionedSensors && pipelineCubes.length === pipeline.sensors.length) {
            console.log("pipelineCubes.length: " + pipelineCubes.length);
            for (var i = 0; i < pipelineCubes.length; i++) {
                console.log(i);
                //novo
                var positionNew = tube.parameters.path.getPointAt(pipeline.sensors[i].normalizedTime);

                pipelineCubes[i].position.set(positionNew.x,positionNew.y,positionNew.z);

                if ( pipeline.sensors[i].normalizedTime > 0.02 )
                var positionNew2 = tube.parameters.path.getPointAt(pipeline.sensors[i].normalizedTime - 0.01) ;
                else
                var positionNew2 = tube.parameters.path.getPointAt(pipeline.sensors[i].normalizedTime + 0.01) ;  

                var angleN = positionNew2.angleTo( positionNew );

            // pipelineCubes[i].rotateX(angleN);

                pipelineCubes[i].lookAt(positionNew2);

                pipelineCubes[i].rotateX(Math.PI/2);

                pipelineCubes[i].angleRadians = pipelineCubes[i].rotation.y;

                console.log( i + JSON.stringify(pipelineCubes[i].rotation));

                pipelineCubes[i].position.z-=5;

                pipelineCubes[i].scale.set(0.98,0.98,0.98);

                var anglAbs = Math.abs(pipelineCubes[i].angleRadians);

                if ( anglAbs > 0.1 && anglAbs < 1.3 )
                     pipelineCubes[i].visible = false;
             


            }
            scene.add(tubeMesh);
            repositionedSensors = true;

        }
        requestAnimationFrame(animate);

        //mesh.rotation.x += 0.01;
        //mesh.rotation.y += 0.02;

        //novo
        if (!sensorView)
        {
                renderer.clear();
                renderer.render(scene, camera);
                renderer.clearDepth();

             /*   if (controlVar.upperCamera)
                   camera.far = 1000;
*/
               
                
                
                if (  controlVar.cameraAttached && 
                     !controlVar.upperCamera &&
                      controlVar.viewFirstPerson &&
                      controlVar.travelCamera && 
                      tubeMesh !== undefined && 
                      tubeMesh2 !== undefined ) 
                        {
                         
                            tubeMesh2.visible=true;  
                            tubeMesh.visible = false; 
                            plane.visible = false; 

                        renderer.render(scene, camera);                       
                    
                        }

                        renderer.render(scene2, camera);

        }

        else {
                
                renderer.clear();
                renderer.render(scene2, camera2);
        
        }

        controls.update();

        //renderer.setSize(container.offsetWidth, container.offsetHeight);

        //window.innerWidth / window.innerHeight
        //camera.aspect = container.innerWidth / container.innerHeight;

        if (loadedTiles > 0) {

            loadMapToPlane();


        }



    }


    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        var width = document.getElementById('webgl').offsetWidth;
        var height = document.getElementById('webgl').offsetHeight

        renderer.setSize(width, height);

        controls.handleResize();

        animate();

    }



    
    function initSky() {

        var geometry = new THREE.PlaneGeometry( 10000, 100000, 32 );
        var material = new THREE.MeshLambertMaterial( {color: 0x916F64, side: THREE.DoubleSide} );
        plane = new THREE.Mesh( geometry, material );
        scene.add( plane );
        plane.position.z=20;
             
                // Add Sky Mesh
                sky = new THREE.Sky();
            // scene.add( sky.mesh );

                // Add Sun Helper
                sunSphere = new THREE.Mesh(
                    new THREE.SphereBufferGeometry( 20000, 16, 8 ),
                    new THREE.MeshBasicMaterial( { color: 0xffffff } )
                );
                sunSphere.position.y = - 700000;
                sunSphere.visible = false;
                scene.add( sunSphere );

                /// GUI

                var effectController  = {
                    turbidity: 10,
                    reileigh: 2,
                    mieCoefficient: 0.005,
                    mieDirectionalG: 0.8,
                    luminance: 1,
                    inclination: 0, // elevation / inclination
                    azimuth: 0.4, // Facing front,
                    sun: ! true
                };

                var distance = 400000;

                function guiChanged() {

                    var uniforms = sky.uniforms;
                    uniforms.turbidity.value = effectController.turbidity;
                    uniforms.reileigh.value = effectController.reileigh;
                    uniforms.luminance.value = effectController.luminance;
                    uniforms.mieCoefficient.value = effectController.mieCoefficient;
                    uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

                    var theta = Math.PI * ( effectController.inclination - 0.5 );
                    var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );

                    sunSphere.position.x = distance * Math.cos( phi );
                    sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
                    sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );

                    sunSphere.visible = effectController.sun;

                    sky.uniforms.sunPosition.value.copy( sunSphere.position );

                    renderer.render( scene, camera );

                }

                guiChanged();
            }