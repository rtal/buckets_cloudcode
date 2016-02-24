
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


Parse.Cloud.define("communitySize", function(request, response) {
	console.log("running communitySize function on community name: " + request.params.name);

	var query = new Parse.Query("User");
	query.containsAll("communities", [request.params.name]);
	query.find({
		success: function(results) {
			response.success(results.length);
		},
		error: function() {
			response.error("couldn't get the number of community members");
		}
	});
});


Parse.Cloud.define("addRohitToCommunity", function(request, response) {
	var communityName = request.params.community;

	Parse.User.logIn("rohit@talreja.com", "password", {
		success: function(user) {
			user.addUnique("communities", communityName);
			user.save();
			response.success("added " + communityName + " successfully");
		},
		error: function(user, error) {
			response.error("couldn't log in")
		}
	});
});


Parse.Cloud.define("numberInvitesForUser", function(request, response) {
	var username = request.params.username;

	var query = new Parse.Query("Invite");
	query.containsAll("members", [username]);
	query.find({
		success: function(results) {
			response.success(results.length);
		},
		error: function() {
			response.error("couldn't find the number of invites for username " + username);
		}
	});
});