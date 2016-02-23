
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


// UNTESTED
Parse.Cloud.define("commonItemsWithCommunityMembers", function(request, response) {
	var communityName = request.params.name;
	var currentUser = request.params.user;

	// get all the bucket items for currentUser
	var query1 = new Parse.Query("BucketItem");
	query1.equalTo("user", currentUser);
	query1.find({
		success: function(results) {
			// put the bucket item names in an array
			var currentUserBucketItemNames = [];
			results.forEach(function(bucketItem) {
				currentUserBucketItemNames.push(item.get("name"));
			});

			// find all other users in communityName
			var query2 = new Parse.Query("User");
			query2.containsAll("communities", [communityName]);
			query2.find({
				success: function(results) {
					usersToNumberItemsInCommon = new Object();

					// for each user, find the number of items in common with currentUser
					results.forEach(function(otherUser) {
						var query3 = new Parse.Query("BucketItem");
						query3.equalTo("user", otherUser);
						query3.find({
							success: function(results) {
								// see how many bucket items otherUser shares with currentUser
								var itemsInCommon = 0;

								results.forEach(function(bucketItem) {
									if (currentUserBucketItemNames.contains(bucketItem.get("name"))) {
										itemsInCommon++;
									}
								});
								usersToNumberItemsInCommon[otherUser] = itemsInCommon;
							}, 
							error: function() {
								// pass
							}
						});
					});


					// RETURN HERE
					response.success(usersToNumberItemsInCommon);
				}, 
				error: function() {
					response.error("couldn't find other users in community");
				}
			});
		}, error: function() {
			response.error("couldn't find given user");
		}
	});
});