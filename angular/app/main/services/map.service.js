export class MapService
{
	constructor( $rootScope,
	             ToastService,
	             $translate,
	             $timeout,
	             leafletData,
	             leafletMarkerEvents,
	             leafletMapEvents,
	             leafletMapDefaults )
	{
		'ngInject';

		L.Icon.Default.imagePath = '/img';
		var vm = this;
		this.located = false;
		this.map = null;
		this.route = null;
		this.meMarker = null;
		this.defaults = {};
		this.markers = {};
		this.leafletData = leafletData;
		this.leafletMarkerEvents = leafletMarkerEvents;

		/**
		 *
		 */
		leafletData.getMap( 'nhMap' ).then( ( map ) =>
		{
			vm.map = map;
			vm.map.invalidateSize();
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

		this.center = {
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
						disableClusteringAtZoom: 15
					}
				}
			}
		};

		this.events = {
			markers: {
				enable: this.leafletMarkerEvents.getAvailableEvents(),
			}
		};

		this.markers = {};
		this.setMarkers = ( offers ) =>
		{

			var markers = {};

			angular.forEach( offers, ( offer, key ) =>
			{

				if( offer.latitude && offer.longitude )
				{
					var marker = {
						offer_id: offer.id,
						lng: parseFloat( offer.latitude ), // jupp, we have them all wrong
						lat: parseFloat( offer.longitude ),
						icon: this.blueIcon,
						layer: 'offers',
						clickable: true,
						draggable: true
					};
					markers[offer.id] = marker;

				}
			} );

			this.markers = markers;
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

	highlightMarker( offer )
	{
		angular.forEach( this.markers, ( marker, key ) =>
		{
			marker.icon = this.blueIcon;
		} );

		var marker = {
			offer_id: offer.id,
			lat: parseFloat( offer.longitude ), // jupp, we have them all wrong
			lng: parseFloat( offer.latitude ),
			icon: this.whiteIcon,
			riseOnHover: true,
			zIndexOffset: 9999999
		};

		this.markers[offer.id] = marker;
	}

	zoomTo( offer )
	{
		this.center = {
			lat: parseFloat( offer.longitude ), // jupp, we have them all wrong
			lng: parseFloat( offer.latitude ),
			zoom: 16
		};
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

	getLocationByAddress( address )
	{

	}

	setLocation()
	{

	}

	showRoute( start, end, type )
	{
		// if (this.route) {
		//     this.map.removeLayer(this.route);
		// }
		// this.route = L.Routing.control({
		//     waypoints: [
		//         L.latLng(end),
		//         L.latLng(start)
		//     ],
		//     lineOptions: {
		//         styles: [{
		//             color: 'white',
		//             opacity: 0.8,
		//             weight: 12
		//         }, {
		//             color: '#357DBA',
		//             opacity: 1,
		//             weight: 6
		//         }]
		//     },
		//     router: L.Routing.mapzen('valhalla-ojkyxg5', {
		//         costing: type
		//     }),
		//     formatter: new L.Routing.mapzenFormatter(),
		//     summaryTemplate: '<div class="start">{name}</div><div class="info {costing}">{distance}, {time}</div>',
		//     routeWhileDragging: false,
		//     language: 'de-DE'
		// });
		// this.route.addTo(this.map);
	}

}
