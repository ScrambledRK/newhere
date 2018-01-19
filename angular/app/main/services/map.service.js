/*
cartodb
:
{mustHaveUrl: true, createLayer: ƒ}
cartodbInteractive
:
{mustHaveKey: true, mustHaveLayer: true, createLayer: ƒ}
cartodbTiles
:
{mustHaveKey: true, createLayer: ƒ}
cartodbUTFGrid
:
{mustHaveKey: true, mustHaveLayer: true, createLayer: ƒ}
custom
:
{createLayer: ƒ}
featureGroup
:
{mustHaveUrl: false, createLayer: ƒ}
geoJSON
:
{mustHaveUrl: true, createLayer: ƒ}
geoJSONAwesomeMarker
:
{mustHaveUrl: false, createLayer: ƒ}
geoJSONShape
:
{mustHaveUrl: false, createLayer: ƒ}
geoJSONVectorMarker
:
{mustHaveUrl: false, createLayer: ƒ}
group
:
{mustHaveUrl: false, createLayer: ƒ}
iip
:
{mustHaveUrl: true, createLayer: ƒ}
imageOverlay
:
{mustHaveUrl: true, mustHaveBounds: true, createLayer: ƒ}
markercluster
:
{mustHaveUrl: false, createLayer: ƒ}
wms
:
{mustHaveUrl: true, createLayer: ƒ}
wmts
:
{mustHaveUrl: true, createLayer: ƒ}
xyz
:
{mustHaveUrl: true, createLayer: ƒ}

 */

export class MapService
{
	constructor( $rootScope,
	             ToastService,
	             ContentService,
	             $translate,
	             $http,
	             $timeout,
	             leafletData,
	             leafletMarkerEvents,
	             leafletMapEvents,
	             leafletMapDefaults )
	{
		'ngInject';

		L.Icon.Default.imagePath = '/img';

		console.log( "YES!\n", L );

		var vm = this;

		//
		this.located = false;
		this.map = null;
		this.route = null;
		this.meMarker = null;
		this.defaults = {};
		this.markers = [];
		this.leafletData = leafletData;
		this.leafletMarkerEvents = leafletMarkerEvents;
		this.highlight = -1;
		this.$timeout = $timeout;
		this.counter = 0;

		//
		this.ContentService = ContentService;

		$rootScope.$on( "contentChanged", ( event ) =>
		{
			console.log( "map content changed, yes man yes" );

			//
			this.setMarkers( this.ContentService.markerList, this.ContentService.offer );
			this.zoomTo( this.ContentService.offer );
		} );

		/**
		 *
		 */
		leafletData.getMap( 'nhMap' ).then( ( map ) =>
		{
			vm.map = map;
			vm.map.invalidateSize();

			//
			// workaround for bug with disableClusteringAtZoom and spiderfyOnMaxZoom
			//
			leafletData.getLayers().then( ( layers ) =>
			{
				layers.overlays.offers.on( 'clusterclick', function( a )
				{
					a.layer.zoomToBounds();
				} );
			} );

			//
			map.on("zoomend", () =>
			{
				console.log( map.getZoom() );
				this.layers.overlays.other_transportation.visible = (map.getZoom() >= 16);
				this.layers.overlays.metro_transportation.visible = (map.getZoom() >= 14);
			} );
		} );

		this.tokens = {
			mapbox: 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ'
		};

		this.blueIcon = {
			iconUrl: 'img/icons/map-marker-blue.png',
			iconSize: [28, 40],
			iconAnchor: [14, 40],
		};

		this.whiteIcon = {
			iconUrl: 'img/icons/map-marker-white.png',
			iconSize: [28, 40],
			iconAnchor: [14, 40],
		};

		// ------------------ //
		// ------------------ //

		this.ToastService = ToastService;
		this.$translate = $translate;
		this.$rootScope = $rootScope;

		this.defaults = {
			tapTolerance: 150
		};

		this.center = this.fixCenter = {
			lat: 48.209272,
			lng: 16.372801,
			zoom: 12
		};

		this.controls = {
			fullscreen: {
				position: 'topleft'
			}
		};

		this.layers = {
			baselayers: {
				xyz: {
					name: 'LightAll',
					url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
					type: 'xyz',
					layerOptions: {
						noWrap: true,
						continuousWorld: false,
						detectRetina: false,
						showOnSelector: false,
						reuseTiles: true,
						maxZoom: 18,
						attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
					}
				}
			},

			overlays: {
				offers: {
					name: 'Offers',
					type: 'markercluster',
					visible: true,
					layerOptions: {
						showCoverageOnHover: false,
						disableClusteringAtZoom: 15,
						spiderfyOnMaxZoom: false,

						iconCreateFunction: function( cluster )
						{
							var childCount = cluster.getChildCount();

							var c = ' marker-cluster-';
							var h = '';

							if( childCount < 10 )
							{
								c += 'small';
							}
							else if( childCount < 100 )
							{
								c += 'medium';
							}
							else
							{
								c += 'large';
							}

							//
							var children = cluster.getAllChildMarkers();

							for( let j = 0; j < children.length; j++ )
							{
								if( children[j].options.isHighlight )
								{
									h = " highlight";
									break;
								}
							}

							return new L.DivIcon( {
								html: '<div><span>' + childCount + '</span></div>',
								className: 'marker-cluster' + c + h,
								iconSize: new L.Point( 40, 40 )
							} );
						}
					}
				},

				//
				stations: {
					name: 'stations',
					type: 'markercluster',
					visible: true,
					layerOptions: {
						showCoverageOnHover: false,
						singleMarkerMode: true,
						maxClusterRadius: 0,
						disableClusteringAtZoom: true,
						animateAddingMarkers: false,
						spiderfyOnMaxZoom: false,

						iconCreateFunction: function( cluster )
						{
							//console.log( cluster );

							let text = "A";

							return new L.DivIcon( {
								html: '<div><span>' + text + '</span></div>',
								iconSize: new L.Point( 40, 40 )
							} );
						}
					}
				}
			}
		};

		this.events = {
			markers: {
				enable: this.leafletMarkerEvents.getAvailableEvents(),
			}
		};

		//
		//
		//
		this.setMarkers = ( offers, highlighted ) =>
		{
			angular.forEach( this.markers, ( marker, key ) =>
			{
				marker.icon = this.blueIcon;
				marker.zIndexOffset = 10;
				marker.isHighlight = false;
			} );

			//
			this.markers = [];

			//
			this.leafletData.getLayers().then( ( layers ) =>
			{
				layers.overlays.offers.refreshClusters();
			} );

			//
			// timeout hack, because there is a angular/leaflet race-condition
			// without it, highlighted clusters stay highlighted although they shouldn't
			//
			this.$timeout( () =>
			{
				angular.forEach( offers, ( offer, key ) =>
				{
					var isFocus = false;
					var icon = this.blueIcon;
					var depth = 10;

					if( highlighted && offer.id === highlighted.id )
					{
						this.highlight = offer.id;

						isFocus = true;
						icon = this.whiteIcon;
						depth = 999999;
					}

					if( offer && offer.latitude && offer.longitude )
					{
						var marker = {
							counter: this.counter++,
							offer_id: offer.id,
							isHighlight: isFocus,
							lng: parseFloat( offer.latitude ), // jupp, we have them all wrong
							lat: parseFloat( offer.longitude ),
							icon: icon,
							layer: 'offers',
							clickable: true,
							draggable: false,
							riseOnHover: true,
							zIndexOffset: depth
						};

						this.markers[offer.id] = marker;
					}
				} );

				//
				// if( this.stationMarkers )
				// 	this.markers.push.apply( this.markers, this.stationMarkers );

				//
				this.leafletData.getLayers().then( ( layers ) =>
				{
					layers.overlays.offers.refreshClusters();
				} );
			}, 0, false );
		};

		//
		//
		$http.get( "public_transport_mini.json" )
			.then( ( response ) =>
				{
					angular.extend( this.layers.overlays, {
						metro_transportation:
							{
								name: 'public transport metro',
								type: 'geoJSONShape',
								data: response.data,
								visible: true,
								layerOptions:
									{
										filter: function(feature)
										{
											return feature.properties.LTYP === "4" ||
												feature.properties.LTYP === "5";
										},

										style: this.getFeatureStyle
									}
							},
						other_transportation:
							{
								name: 'public transport other',
								type: 'geoJSONShape',
								data: response.data,
								visible: true,
								layerOptions:
									{
										filter: function(feature)
										{
											return feature.properties.LTYP !== "4" &&
												feature.properties.LTYP !== "5";
										},

										style: this.getFeatureStyle
									}
							}
					} );
				},
				( response ) =>
				{
					console.log( "error", response );
				} );

		//
		//
		// this.stationMarkers = [];
		//
		// $http.get( "stations.json" )
		// 	.then( ( response ) =>
		// 		{
		// 			console.log("result station: ", response );
		//
		// 			angular.forEach( response.data, ( station, key ) =>
		// 			{
		// 				var marker = {
		// 					lines: station.relatedLines,
		// 					lng: parseFloat( station.longitude ),
		// 					lat: parseFloat( station.latitude ),
		// 					icon: this.blueIcon,
		// 					layer: 'stations',
		// 					clickable: false,
		// 					draggable: false,
		// 					riseOnHover: false,
		// 					zIndexOffset: 5
		// 				};
		//
		// 				if( this.stationMarkers.length < 10 )
		// 					this.stationMarkers.push( marker );
		// 			} );
		// 		},
		// 		( response ) =>
		// 		{
		// 			console.log( "error", response );
		// 		} );
	}

	getFeatureStyle( feature )
	{
		//console.log( feature );

		//
		let color = '#4a6aff';
		let alpha = 0.2 + Math.random() * 0.6;
		let weight =  1.0;

		//
		switch( feature.properties.LTYP )
		{
			case '1':   // Straßenbahn
				color = '#ff8668';
				break;

			case '2':   // Autobus
				color = '#55baff';
				break;

			case '3': // Regionalbus
				color = '#6affbf';
				break;

			case '4': // U-Bahn
			{
				switch( feature.properties.LBEZEICHNUNG )
				{
					case "U1":
						color = "#ff0600";
						break;

					case "U2":
						color = "#bb00ff";
						break;

					case "U3":
						color = "#ff7825";
						break;

					case "U4":
						color = "#74ff30";
						break;

					case "U5":
						color = "#44ffca";
						break;

					case "U6":
						color = "#ffbf41";
						break;
				}

				weight = 2.5;
				alpha = 0.9;
				break;
			}

			case "5":   // S-Bahn
				color = '#3247ff'
				weight = 2.0;
				alpha = 0.6;
				break;
		}

		return {
			color: color,
			weight: weight,
			opacity: alpha
		};
	}

	invalidateSize()
	{
		this.leafletData.getMap( 'nhMap' ).then( ( map ) =>
		{
			console.log( "map.service invalidate size" );
			map.invalidateSize();
		} );
	}

	zoomTo( offer )
	{
		if( offer && offer.latitude && offer.longitude )
		{
			this.center = {
				lat: parseFloat( offer.longitude ), // jupp, we have them all wrong
				lng: parseFloat( offer.latitude ),
				zoom: 16
			};
		}
		else
		{
			this.center = this.fixCenter;
		}
	}

	/**
	 *
	 * @param success
	 * @param error
	 */
	getLocation( success, error )
	{
		if( navigator.geolocation )
		{
			navigator.geolocation.getCurrentPosition( ( position ) =>
			{
				console.log( position.coords.latitude + ' ' + position.coords.longitude );

				this.center.lat = position.coords.latitude;
				this.center.lng = position.coords.longitude;
				this.center.zoom = 12;

				this.$rootScope.$apply();

				if( typeof success == "function" )
					success( position );
			} );
		}
		else
		{
			this.ToastService.error( 'Standort kann auf Grund fehlender Browserunterstützung nicht abgerufen werden.' );

			if( typeof error == "function" )
				error();
		}
	}

	/**
	 *
	 */
	locate()
	{
		this.leafletData.getMap( 'nhMap' ).then( ( map ) =>
		{
			map.locate( {
				setView: true,
				maxZoom: 14
			} );

			map.on( 'locationfound', ( e ) =>
			{
				var pulsingIcon = L.icon.pulse( {
					iconSize: [10, 10],
					color: '#357DBA'
				} );

				this.meMarker = L.marker( e.latlng, {
					icon: pulsingIcon
				} );

				if( !this.located )
				{
					this.meMarker.addTo( map );
					this.located = true;
				}
			} )
				.on( 'locationerror', () =>
				{
					this.ToastService.error( 'Standort konnte nicht ermittelt werden!' );
				} )
		} )
	}


}
