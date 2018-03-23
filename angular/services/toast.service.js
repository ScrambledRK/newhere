/**
 * @name ToastService
 */
export class ToastService
{
	constructor( $mdToast, $translate )
	{
		'ngInject';

		this.$mdToast = $mdToast;
		this.$translate = $translate;

		this.delay = 6000;
		this.position = 'bottom right';
		this.action = 'OK';
	}

	/**
	 *
	 * @param {string} content
	 * @returns {boolean}
	 */
	show( content )
	{
		if( !content )
			return false;

		this.$translate( content ).then( ( msg ) =>
		{
			this.$mdToast.show
			(
				this.$mdToast.simple()
					.content( msg )
					.position( this.position )
					.action( this.action )
					.hideDelay( this.delay )
			)
		} );
	}

	/**
	 *
	 * @param {string} content
	 * @returns {boolean}
	 */
	error( content, track )
	{
		if( !content )
			return false;

		//
		if( typeof content === 'object' )
		{
			if( content.data && content.data.message )
				content = content.data.message;
		}

		if( track )
		{
			window.ga('send', 'exception', {
				'exDescription': content,
				'exFatal': false
			});
		}

		//
		this.$translate( content ).then( ( msg ) =>
		{
			this.$mdToast.show
			(
				this.$mdToast.simple()
					.content( msg )
					.position( this.position )
					.action( this.action )
					.hideDelay( this.delay )
					.theme( 'warn' )
			)
		} );
	}
}
