
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


Parse.Cloud.define("communitySize", function(request, response) {
	console.log("running communitySize function on community name: " + request.params.name);

	var query = new Parse.Query("User");
	query.containsAll("communities", [request.params.name]);
	query.find ({
		success: function(results) {
			response.success(results.length);
		},
		error: function() {
			response.error("couldn't get the number of community members");
		}
	});
});