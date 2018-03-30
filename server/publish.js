Meteor.publish("User",function(){
	return User.find();
});

Meteor.publish("Profile",function(){
	return Profile.find();
});

Meteor.publish("Project",function(){
	return Project.find();
});

Meteor.publish("Organization",function(){
	return Organization.find();
});

Meteor.publish("Organization",function(){
	return Organization.find();
});

Meteor.publish("Well",function(){
	return Well.find();
});

Meteor.publish("LightBox",function(){
	return LightBox.find();
});

Meteor.publish("Pole",function(){
	return Pole.find();
});

Meteor.publish("ODF",function(){
	return ODF.find();
});

Meteor.publish("UpPoint",function(){
	return UpPoint.find();
});

Meteor.publish("WallHang",function(){
	return WallHang.find();
});

Meteor.publish("JointBox",function(){
	return JointBox.find();
});

Meteor.publish("Other",function(){
	return Other.find();
});

Meteor.publish("Cable",function(){
	return Cable.find();
});

Meteor.publish("Conduit",function(){
	return Conduit.find();
});

Meteor.publish("CableSegment",function(){
	return CableSegment.find();
});

Meteor.publish("CoreRFID",function(){
	return CoreRFID.find();
});

Meteor.publish("JumpCable",function(){
	return JumpCable.find();
});