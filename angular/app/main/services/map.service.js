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


		var vm = this;

		this.ContentService = ContentService;
		this.ToastService = ToastService;
		this.$translate = $translate;
		this.$rootScope = $rootScope;
		this.$timeout = $timeout;

		this.leafletData = leafletData;
		this.leafletMarkerEvents = leafletMarkerEvents;

		// ------------------ //
		// ------------------ //

		//
		this.map = null;
		this.markers = [];

		//
		L.Icon.Default.imagePath = '/img';

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

		//
		this.defaults = {
			tapTolerance: 150
		};

		this.center = this.fixCenter = {
			lat: 48.209272,
			lng: 16.372801,
			zoom: 12
		};

		// ------------------ //
		// ------------------ //

		this.layers = this._createLayers();
		this._setupLeafletData( leafletData );

		//
		// this.$timeout( () =>
		// {
		// 	this._createTransportLayer( $http );
		// 	this._createStationLayer( $http );
		// }, 1, false );

		//
		this.events = {
			markers: {
				enable: this.leafletMarkerEvents.getAvailableEvents(),
			}
		};

		// ------------------ //
		// ------------------ //

		$rootScope.$on( "contentChanged", ( event ) =>
		{
			this.setMarkers( this.ContentService.markerList, this.ContentService.offer );
			this.zoomTo( this.ContentService.offer );
		} );

		//
		// angular? bug - this method has to be defined within the constructor
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
				if( this.markers.length > 0 )
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
					let isFocus = false;
					let icon = this.blueIcon;
					let depth = 10;

					if( highlighted && offer.id === highlighted.id )
					{
						isFocus = true;
						icon = this.whiteIcon;
						depth = 999999;
					}

					//
					if( offer && offer.latitude && offer.longitude )
					{
						let marker = {
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

						this.markers.push( marker );
					}
				} );

				//
				if( this.stationMarkers )
					this.markers.push.apply( this.markers, this.stationMarkers );

				//
				this.leafletData.getLayers().then( ( layers ) =>
				{
					try
					{
						if( this.markers.length > 0 )
							layers.overlays.offers.refreshClusters();
					}
					catch(err)
					{
						//;
					}
				} );
			}, 0, false );
		};

		// ------------------ //
		// ------------------ //


	}

	// ----------------------------------------------------------------------------------- //
	// ----------------------------------------------------------------------------------- //

	/**
	 *
	 * @returns
	 * @private
	 */
	_createLayers()
	{
		return {
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

						iconCreateFunction: this._createOfferMarker
					}
				},

				//
				stations: {
					name: 'stations',
					type: 'featureGroup',
					visible: true,
					layerOptions: {}
				}
			}
		};
	}

	/**
	 *
	 * @param cluster
	 * @returns {leafletHelpers.Leaflet.DivIcon|{is, equal}|*}
	 * @private
	 */
	_createOfferMarker( cluster )
	{
		let childCount = cluster ? cluster.getChildCount() : 0;

		let c = ' marker-cluster-';
		let h = '';

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
		if( cluster )
		{
			let children = cluster.getAllChildMarkers();

			for( let j = 0; j < children.length; j++ )
			{
				if( children[j].options.isHighlight )
				{
					h = " highlight";
					break;
				}
			}
		}

		return new L.DivIcon( {
			html: '<div><span>' + childCount + '</span></div>',
			className: 'marker-cluster' + c + h,
			iconSize: new L.Point( 40, 40 )
		} );
	}

	/**
	 *
	 * @param leafletData
	 * @private
	 */
	_setupLeafletData( leafletData )
	{
		leafletData.getMap( 'nhMap' ).then( ( map ) =>
		{
			this.map = map;
			this.map.invalidateSize();

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
			map.on( "zoomend", () =>
			{
				if( this.layers.overlays.other_transportation )
					this.layers.overlays.other_transportation.visible = (map.getZoom() >= 16);

				if( this.layers.overlays.metro_transportation )
					this.layers.overlays.metro_transportation.visible = (map.getZoom() >= 14);
			} );
		} );
	}

	// ----------------------------------------------------------------------------------- //
	// ----------------------------------------------------------------------------------- //
	// Transportation

	/**
	 *
	 * @param $http
	 * @private
	 */
	_createTransportLayer( $http )
	{
		if( $http )
		{
			this.tp1 = null;
			this.tp2 = null;

			$http.get( "public_transport_1.json" )
				.then( ( response ) =>
					{
						this.tp1 = response;
						this._createTransportLayer( null );
					},
					( response ) =>
					{
						//console.log( "error", response );
					} );

			$http.get( "public_transport_2.json" )
				.then( ( response ) =>
					{
						this.tp2 = response;
						this._createTransportLayer( null );
					},
					( response ) =>
					{
						//console.log( "error", response );
					} );
		}

		// ---------------------- //

		if( this.tp1 && this.tp2 )
		{
			let data = {
				type: "FeatureCollection",
				totalFeatures: 3400,
				features:[],
				crs: {
					type: "name",
					properties: {
						name: "urn:ogc:def:crs:EPSG::4326"
					}
				}
			};

			//
			data.features.push.apply( data.features, this.tp1.data.features );
			data.features.push.apply( data.features, this.tp2.data.features );

			//
			angular.extend( this.layers.overlays, {
				metro_transportation:
					{
						name: 'public transport metro',
						type: 'geoJSONShape',
						data: data,
						visible: true,
						layerOptions:
							{
								filter: function( feature )
								{
									return feature.properties.LTYP === "4" ||
										feature.properties.LTYP === "5";
								},

								style: this._getTransportFeatureStyle
							}
					},
				other_transportation:
					{
						name: 'public transport other',
						type: 'geoJSONShape',
						data: data,
						visible: true,
						layerOptions:
							{
								filter: function( feature )
								{
									return feature.properties.LTYP !== "4" &&
										feature.properties.LTYP !== "5";
								},

								style: this._getTransportFeatureStyle
							}
					}
			} );
		}
	}

	/**
	 *
	 * @param feature
	 * @returns {{color: string, weight: number, opacity: number}}
	 * @private
	 */
	_getTransportFeatureStyle( feature )
	{
		//console.log( feature );

		//
		let color = '#4a6aff';
		let alpha = 0.2 + Math.random() * 0.6;
		let weight = 1.0;

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
				color = '#3247ff';
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

	/**
	 *
	 * @param $http
	 * @private
	 */
	_createStationLayer( $http )
	{
		this.stationMarkers = [];

		//
		$http.get( "stations_mini.json" )
			.then( ( response ) =>
				{
					let count = 0;

					angular.forEach( response.data.list, ( station, key ) =>
					{
						let marker = {
							lines: station.relatedLines,
							name: station.name,
							lng: parseFloat( station.longitude ),
							lat: parseFloat( station.latitude ),
							icon: this._createStationIcon( station ),
							layer: 'stations',
							clickable: false,
							draggable: false,
							riseOnHover: false,
							zIndexOffset: 5
						};

						if( count++ < 100 )
						{
							L.marker([marker.lat, marker.lng], marker).addTo(this.map)
								.bindPopup( marker.name );
						}

						//if( this.stationMarkers.length < 10 )
						//	this.stationMarkers.push( marker );
					} );
				},
				( response ) =>
				{
					//console.log( "error", response );
				} );
	}

	_createStationIcon( station )
	{
		let text = station.relatedLines;

		return new L.DivIcon( {
			html: '<div><span>' + text + '</span></div>',
			iconSize: new L.Point( 40, 40 ),
			className: 'leaflet-transport-icon'
		} );

	}

	// ----------------------------------------------------------------------------------- //
	// ----------------------------------------------------------------------------------- //

	/**
	 *
	 */
	invalidateSize()
	{
		console.log( "map.service invalidate size - request" );

		this.leafletData.getMap( 'nhMap' ).then( ( map ) =>
		{
			console.log( "map.service invalidate size" );
			map.invalidateSize();
		} );
	}

	/**
	 *
	 * @param offer
	 */
	zoomTo( offer )
	{
		console.log( "zoomTo:", offer );

		//
		// timeout seems necessary, works most of the time without, but sometimes ..
		// switching from a zoomed offer to a null offer (say provider) it doesn't
		// do anything ...
		//
		this.$timeout( () =>
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
		}, 1, false );

	}

	// ----------------------------------------------------------------------------------- //
	// ----------------------------------------------------------------------------------- //

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
				//console.log( position.coords.latitude + ' ' + position.coords.longitude );

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
