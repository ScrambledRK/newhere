/**
 * https://github.com/angular/material/issues/1742
 * @param $provide
 * @constructor
 */
export function MaterialPlaceHolderDirective($provide){
	'ngInject';

	// TODO: might be performance issue
	$provide.decorator('placeholderDirective', ['$delegate', '$translate', function ($delegate, $translate) {
		var directive = $delegate[0];
		var link = directive.link.pre;

		directive.compile = function () {
			return function (scope, element, attr, inputContainer) {

				if(!inputContainer)
					return;

				link.apply(this, arguments);

				setTranslation();

				scope.$root.$on('$translateChangeEnd', function () {
					setTranslation();
				});

				// scope.$root.$on('languageChanged', function () {
				// 	setTranslation();
				// });

				function setTranslation() {
					$translate(attr.placeholder).then(function (translation) {
						inputContainer.element.find('label').text(translation);
						element.attr("placeholder", translation);
					});
				}
			};
		};

		return $delegate;
	}]);
}
