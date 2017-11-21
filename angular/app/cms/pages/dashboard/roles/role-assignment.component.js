class RoleAssignmentController
{
	/**
	 */
	constructor( UserService )
	{
		'ngInject';

		this.UserService = UserService;

		// -------------- //

		this.assignGroup = "assign";
		this.isUser = false;
	}

	onAssignGroup(group)
	{
		console.log(group);
	}
// --------------------------------------- //
	// --------------------------------------- //

	//
	isElementVisible( name )
	{
		if( name === "request-join" )
			return this.UserService.isWithoutRole();

		//
		return false;
	}

	//
	isElementEnabled( name )
	{
		return false;
	}
}

//
export const RoleAssignmentComponent = {

	template: require( './role-assignment.component.html' ),
	controller: RoleAssignmentController,
	controllerAs: 'vm',
	bindings: {}
};