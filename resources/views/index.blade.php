<!doctype html>
<html ng-app="app"
      ng-strict-di lang="{{App::getLocale()}}">
    <head>

	    <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible"
              content="IE=edge">

        <meta name="viewport"
              content="width=device-width, initial-scale=1.0">

        <meta name="description"
              content="Refugess should find their way around. New Here will help.">

        <link rel="stylesheet"
              href="{!! elixir('css/vendor.main.css') !!}">
	    <link rel="stylesheet"
                href="{!! elixir('css/vendor.cms.css') !!}">
        <link rel="stylesheet"
              href="{!! elixir('css/app.css') !!}">

        <link href='https://fonts.googleapis.com/css?family=Lato:300,400,700'
              rel='stylesheet'
              type='text/css'>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
              rel="stylesheet">

        <meta name="apple-mobile-web-app-capable"
              content="yes">
        <meta name="mobile-web-app-capable"
              content="yes">

        <title>new here : welcome</title>

    <script src="{!! elixir('js/vendor.main.js') !!}"></script>
	<script src="{!! elixir('js/main.bundle.js') !!}"></script>
	<script src="{!! elixir('js/partials.js') !!}"></script>

    <script async src='https://www.google-analytics.com/analytics.js'></script>

        <script type="text/javascript">
            // akward way to reference the sources later (random names due to cache-busting)
            window.newhere =
                {
                	css: [
                        "{!! elixir('css/tinymcs_custom.css') !!}",
                        "https://fonts.googleapis.com/icon?family=Material+Icons",
                        'https://fonts.googleapis.com/css?family=Lato:300,400,700'
                    ],

                    cms: [
	                    "{!! elixir('js/vendor.cms.js') !!}",
	                    "{!! elixir('js/cms.bundle.js') !!}"
                    ]
                }
        </script>

        <!--[if lte IE 10]>
        <script type="text/javascript">document.location.href = '/unsupported-browser'</script>
        <![endif]-->
    </head>
    <body>
        <div id="cookie-container" ng-show="$root.showCookiePolicy"></div>
        <div ui-view="front"></div>

        <script>
            window.initAnalytics = function( hasConsented )
            {
                console.log("cookies?", hasConsented );

                if( hasConsented )
                {
                	if( !window.ga )
                    {
                    	console.log("creating gaga");

	                    window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
                        window.ga('create', "{!! Config::get('services.analytics.key') !!}", 'auto', {'siteSpeedSampleRate': 100} );
                    }

                    if( window.onCookieConsent )
                        window.onCookieConsent( hasConsented );
                }
                else
                {
                    window.ga = null;
                }
            };

            window.cookieconsent.initialise({
                container: document.getElementById("cookie-container"),

                palette:{
                    popup: {background: "#fff"},
                    button: {background: "#357DBA"},
                },

                compliance: {
                    'info': '<div class="cc-compliance">\{\{dismiss\}\}</div>',
                    'opt-in': '<div class="cc-compliance cc-highlight">\{\{deny}}\{\{allow\}\}</div>',
                    'opt-out': '<div class="cc-compliance cc-highlight">\{\{deny}}\{\{dismiss\}\}</div>',
                },
                revokable:true,
                type:'opt-in',

                onInitialise: function(status)
                {
	                window.mycc = status;   // used to show/hide the revoke button
                    window.initAnalytics(this.hasConsented());
                },
                onStatusChange: function(status)
                {
	                window.mycc = status;
                    window.initAnalytics(this.hasConsented());
                },
                onRevokeChoice: function(status)
                {
	                window.mycc = status;
                    window.initAnalytics(false);
                },
                law: {
                    regionalLaw: false,
                },
                location: false,
            });
        </script>

    </body>
</html>
