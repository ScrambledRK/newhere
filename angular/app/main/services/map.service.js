export class MapService
{
	constructor( $rootScope,
	             ToastService,
	             ContentService,
	             $translate,
	             $timeout,
	             leafletData,
	             leafletMarkerEvents,
	             leafletMapEvents,
	             leafletMapDefaults )
	{
		'ngInject';

		L.Icon.Default.imagePath = '/img';

		console.log("YES!\n", L );

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
			console.log("map content changed, yes man yes");

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
			leafletData.getLayers().then( (layers) => {
				layers.overlays.offers.on('clusterclick', function (a) {
					a.layer.zoomToBounds();
				});
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

						iconCreateFunction: function(cluster)
						{
							var childCount = cluster.getChildCount();

							var c = ' marker-cluster-';
							var h = '';

							if (childCount < 10) {
								c += 'small';
							} else if (childCount < 100) {
								c += 'medium';
							} else {
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

							return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c + h, iconSize: new L.Point(40, 40) });
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
			this.leafletData.getLayers().then( (layers) => {
				layers.overlays.offers.refreshClusters();
			});

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
				this.leafletData.getLayers().then( ( layers ) =>
				{
					layers.overlays.offers.refreshClusters();
				} );
			}, 0, false );
		};
	}

	invalidateSize()
	{
		this.leafletData.getMap( 'nhMap' ).then( ( map ) =>
		{
			console.log("map.service invalidate size");
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
